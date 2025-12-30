import { createClient } from '@/lib/supabase/server';
import type { AlbumImage } from '@/types/album';
import type { Database } from './types';

type AlbumImageRow = Database['public']['Tables']['album_images']['Row'];
type AlbumImageInsert = Database['public']['Tables']['album_images']['Insert'];
type AlbumImageUpdate = Database['public']['Tables']['album_images']['Update'];

/**
 * 앨범의 모든 이미지 조회
 */
export async function getAlbumImages(albumId: string): Promise<AlbumImage[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('album_images')
    .select('*')
    .eq('album_id', albumId)
    .order('position', { ascending: true });

  if (error) {
    throw new Error(`앨범 이미지 조회 실패: ${error.message}`);
  }

  return (data || []).map((row) => {
    const image = row as AlbumImageRow;
    return {
      id: image.id,
      albumId: image.album_id,
      imageUrl: image.image_url,
      title: image.title,
      description: image.description,
      position: image.position,
      createdAt: image.created_at,
    };
  });
}

/**
 * 공개된 앨범의 모든 이미지 조회 (갤러리용, 앨범 정보 포함)
 */
export async function getPublishedAlbumImages(): Promise<(AlbumImage & { albumTitle: string })[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('album_images')
    .select(`
      *,
      albums!inner (id, title, is_published)
    `)
    .eq('albums.is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`공개 앨범 이미지 조회 실패: ${error.message}`);
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    albumId: row.album_id,
    imageUrl: row.image_url,
    title: row.title,
    description: row.description,
    position: row.position,
    createdAt: row.created_at,
    albumTitle: row.albums.title,
  }));
}

/**
 * 앨범 이미지 추가
 */
export async function addAlbumImage(image: {
  albumId: string;
  imageUrl: string;
  title?: string;
  description?: string;
  position?: number;
}): Promise<AlbumImage> {
  const supabase = await createClient();

  // position이 지정되지 않으면 현재 최대값 + 1
  if (image.position === undefined) {
    const existingImages = await getAlbumImages(image.albumId);
    image.position = existingImages.length > 0 
      ? Math.max(...existingImages.map(img => img.position)) + 1 
      : 0;
  }

  const insertData: AlbumImageInsert = {
    album_id: image.albumId,
    image_url: image.imageUrl,
    title: image.title || null,
    description: image.description || null,
    position: image.position,
  };

  const { data, error } = await supabase
    .from('album_images')
    .insert(insertData as any)
    .select()
    .single();

  if (error) {
    throw new Error(`앨범 이미지 추가 실패: ${error.message}`);
  }

  const insertedImage = data as AlbumImageRow;

  return {
    id: insertedImage.id,
    albumId: insertedImage.album_id,
    imageUrl: insertedImage.image_url,
    title: insertedImage.title,
    description: insertedImage.description,
    position: insertedImage.position,
    createdAt: insertedImage.created_at,
  };
}

/**
 * 앨범 이미지 수정
 */
export async function updateAlbumImage(
  id: string,
  updates: {
    title?: string;
    description?: string;
    position?: number;
  }
): Promise<AlbumImage> {
  const supabase = await createClient();

  const updateData: any = {};
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.position !== undefined) updateData.position = updates.position;

  const { data, error } = await (supabase
    .from('album_images') as any)
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`앨범 이미지 수정 실패: ${error.message}`);
  }

  const updatedImage = data as AlbumImageRow;

  return {
    id: updatedImage.id,
    albumId: updatedImage.album_id,
    imageUrl: updatedImage.image_url,
    title: updatedImage.title,
    description: updatedImage.description,
    position: updatedImage.position,
    createdAt: updatedImage.created_at,
  };
}

/**
 * 앨범 이미지 삭제
 */
export async function deleteAlbumImage(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('album_images').delete().eq('id', id);

  if (error) {
    throw new Error(`앨범 이미지 삭제 실패: ${error.message}`);
  }
}

/**
 * 앨범의 모든 이미지 삭제
 */
export async function deleteAllAlbumImages(albumId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('album_images')
    .delete()
    .eq('album_id', albumId);

  if (error) {
    throw new Error(`앨범 이미지 전체 삭제 실패: ${error.message}`);
  }
}

