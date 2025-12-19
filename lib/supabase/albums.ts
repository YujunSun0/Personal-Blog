import { createClient } from '@/lib/supabase/server';
import type { Album, AlbumListItem, AlbumWithImages } from '@/types/album';

/**
 * 공개된 모든 앨범 목록 조회
 */
export async function getPublishedAlbums(): Promise<AlbumListItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('albums')
    .select(`
      *,
      album_images (id)
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`앨범 목록 조회 실패: ${error.message}`);
  }

  return (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    coverImageUrl: row.cover_image_url,
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    imageCount: (row.album_images as any[])?.length || 0,
  }));
}

/**
 * 모든 앨범 목록 조회 (관리자용)
 */
export async function getAllAlbums(): Promise<AlbumListItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('albums')
    .select(`
      *,
      album_images (id)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`앨범 목록 조회 실패: ${error.message}`);
  }

  return (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    coverImageUrl: row.cover_image_url,
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    imageCount: (row.album_images as any[])?.length || 0,
  }));
}

/**
 * 앨범 ID로 앨범 조회 (이미지 포함)
 */
export async function getAlbumById(id: string): Promise<AlbumWithImages | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('albums')
    .select(`
      *,
      album_images (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`앨범 조회 실패: ${error.message}`);
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    coverImageUrl: data.cover_image_url,
    isPublished: data.is_published,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    images: (data.album_images as any[])
      .map((img) => ({
        id: img.id,
        albumId: img.album_id,
        imageUrl: img.image_url,
        title: img.title,
        description: img.description,
        position: img.position,
        createdAt: img.created_at,
      }))
      .sort((a, b) => a.position - b.position),
  };
}

/**
 * 앨범 생성
 */
export async function createAlbum(album: {
  title: string;
  description?: string;
  coverImageUrl?: string;
  isPublished?: boolean;
}): Promise<Album> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('albums')
    .insert({
      title: album.title,
      description: album.description || null,
      cover_image_url: album.coverImageUrl || null,
      is_published: album.isPublished ?? false,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`앨범 생성 실패: ${error.message}`);
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    coverImageUrl: data.cover_image_url,
    isPublished: data.is_published,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

/**
 * 앨범 수정
 */
export async function updateAlbum(
  id: string,
  updates: {
    title?: string;
    description?: string;
    coverImageUrl?: string;
    isPublished?: boolean;
  }
): Promise<Album> {
  const supabase = await createClient();

  const updateData: any = {};
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.coverImageUrl !== undefined) updateData.cover_image_url = updates.coverImageUrl;
  if (updates.isPublished !== undefined) updateData.is_published = updates.isPublished;

  const { data, error } = await supabase
    .from('albums')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`앨범 수정 실패: ${error.message}`);
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    coverImageUrl: data.cover_image_url,
    isPublished: data.is_published,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

/**
 * 앨범 삭제
 */
export async function deleteAlbum(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('albums').delete().eq('id', id);

  if (error) {
    throw new Error(`앨범 삭제 실패: ${error.message}`);
  }
}

