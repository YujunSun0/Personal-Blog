import { createClient } from '@/lib/supabase/server';
import type { Album, AlbumListItem, AlbumWithImages } from '@/types/album';
import type { Database } from './types';

type AlbumRow = Database['public']['Tables']['albums']['Row'];
type AlbumInsert = Database['public']['Tables']['albums']['Insert'];
type AlbumUpdate = Database['public']['Tables']['albums']['Update'];
type AlbumImageRow = Database['public']['Tables']['album_images']['Row'];

type AlbumWithImagesRow = AlbumRow & {
  album_images?: Array<{ id: string }>;
};

type AlbumWithFullImagesRow = AlbumRow & {
  album_images?: Array<AlbumImageRow>;
};

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

  return (data || []).map((row: unknown) => {
    const album = row as AlbumWithImagesRow;
    return {
      id: album.id,
      title: album.title,
      description: album.description,
      coverImageUrl: album.cover_image_url,
      isPublished: album.is_published,
      createdAt: album.created_at,
      updatedAt: album.updated_at,
      imageCount: album.album_images?.length || 0,
    };
  });
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

  return (data || []).map((row: unknown) => {
    const album = row as AlbumWithImagesRow;
    return {
      id: album.id,
      title: album.title,
      description: album.description,
      coverImageUrl: album.cover_image_url,
      isPublished: album.is_published,
      createdAt: album.created_at,
      updatedAt: album.updated_at,
      imageCount: album.album_images?.length || 0,
    };
  });
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

  const album = data as AlbumWithFullImagesRow;

  return {
    id: album.id,
    title: album.title,
    description: album.description,
    coverImageUrl: album.cover_image_url,
    isPublished: album.is_published,
    createdAt: album.created_at,
    updatedAt: album.updated_at,
    images: (album.album_images || [])
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
export async function createAlbum(albumData: {
  title: string;
  description?: string;
  coverImageUrl?: string;
  isPublished?: boolean;
}): Promise<Album> {
  const supabase = await createClient();

  const insertData: AlbumInsert = {
    title: albumData.title,
    description: albumData.description || null,
    cover_image_url: albumData.coverImageUrl || null,
    is_published: albumData.isPublished ?? false,
  };

  const { data, error } = await (supabase
    .from('albums') as unknown as {
      insert: (values: AlbumInsert) => {
        select: () => {
          single: () => Promise<{ data: AlbumRow | null; error: { message: string } | null }>;
        };
      };
    })
    .insert(insertData)
    .select()
    .single();

  if (error) {
    throw new Error(`앨범 생성 실패: ${error.message}`);
  }

  const album = data as AlbumRow;

  return {
    id: album.id,
    title: album.title,
    description: album.description,
    coverImageUrl: album.cover_image_url,
    isPublished: album.is_published,
    createdAt: album.created_at,
    updatedAt: album.updated_at,
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

  const updateData: AlbumUpdate = {};
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.coverImageUrl !== undefined) updateData.cover_image_url = updates.coverImageUrl;
  if (updates.isPublished !== undefined) updateData.is_published = updates.isPublished;

  const { data, error } = await (supabase
    .from('albums') as unknown as {
      update: (values: AlbumUpdate) => {
        eq: (column: string, value: string) => {
          select: () => {
            single: () => Promise<{ data: AlbumRow | null; error: { message: string } | null }>;
          };
        };
      };
    })
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`앨범 수정 실패: ${error.message}`);
  }

  const album = data as AlbumRow;

  return {
    id: album.id,
    title: album.title,
    description: album.description,
    coverImageUrl: album.cover_image_url,
    isPublished: album.is_published,
    createdAt: album.created_at,
    updatedAt: album.updated_at,
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

