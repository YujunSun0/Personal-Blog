import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';
import type { Post, PostListItem } from '@/types/post';

type PostRow = Database['public']['Tables']['posts']['Row'];
type PostInsert = Database['public']['Tables']['posts']['Insert'];
type PostUpdate = Database['public']['Tables']['posts']['Update'];

/**
 * 데이터베이스 Row를 Post 타입으로 변환
 */
function mapPostRowToPost(row: PostRow): Post {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    content: row.content,
    type: row.type,
    thumbnailUrl: row.thumbnail_url,
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * 데이터베이스 Row를 PostListItem 타입으로 변환
 */
function mapPostRowToPostListItem(row: PostRow): PostListItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.type,
    thumbnailUrl: row.thumbnail_url,
    createdAt: row.created_at,
  };
}

/**
 * Post 타입을 데이터베이스 Insert 타입으로 변환
 */
function mapPostToInsert(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): PostInsert {
  return {
    title: post.title,
    description: post.description,
    content: post.content,
    type: post.type,
    thumbnail_url: post.thumbnailUrl,
    is_published: post.isPublished,
  };
}

/**
 * 공개된 글 목록 조회 (is_published = true)
 * 태그 정보 포함
 */
export async function getPublishedPosts(
  tagName?: string,
  postType?: 'TECH' | 'TROUBLESHOOTING' | 'PROJECT'
): Promise<PostListItem[]> {
  const supabase = await createClient();

  let postIds: string[] | undefined;

  // 태그 필터링이 있는 경우
  if (tagName) {
    // 먼저 태그 ID 찾기
    const { data: tagData, error: tagError } = await supabase
      .from('tags')
      .select('id')
      .eq('name', tagName)
      .single();

    if (tagError || !tagData) {
      return []; // 태그가 없으면 빈 배열 반환
    }

    // 해당 태그가 연결된 글 ID 찾기
    const { data: postTagsData, error: postTagsError } = await supabase
      .from('post_tags')
      .select('post_id')
      .eq('tag_id', tagData.id);

    if (postTagsError || !postTagsData || postTagsData.length === 0) {
      return [];
    }

    postIds = postTagsData.map((pt) => pt.post_id);
  }

  // 글 조회
  let query = supabase
    .from('posts')
    .select('*')
    .eq('is_published', true);

  // 타입 필터링
  if (postType) {
    query = query.eq('type', postType);
  }

  // 태그 필터링
  if (postIds) {
    query = query.in('id', postIds);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch published posts: ${error.message}`);
  }

  // 각 글의 태그 조회
  const postsWithTags = await Promise.all(
    data.map(async (post) => {
      const { data: postTags } = await supabase
        .from('post_tags')
        .select(`
          tag_id,
          tags(id, name)
        `)
        .eq('post_id', post.id);

      const tags = postTags?.map((pt: any) => ({
        id: pt.tags.id,
        name: pt.tags.name,
      })) || [];

      return {
        ...mapPostRowToPostListItem(post),
        tags,
      };
    })
  );

  return postsWithTags;
}

/**
 * 모든 글 목록 조회 (관리자용)
 */
export async function getAllPosts(): Promise<PostListItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch all posts: ${error.message}`);
  }

  return data.map(mapPostRowToPostListItem);
}

/**
 * ID로 글 조회
 */
export async function getPostById(id: string): Promise<Post | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    throw new Error(`Failed to fetch post: ${error.message}`);
  }

  return mapPostRowToPost(data);
}

/**
 * Slug로 글 조회 (slug는 ID를 사용)
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  return getPostById(slug);
}

/**
 * 새 글 생성
 */
export async function createPost(
  post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Post> {
  const supabase = await createClient();

  const insertData = mapPostToInsert(post);

  const { data, error } = await supabase
    .from('posts')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create post: ${error.message}`);
  }

  return mapPostRowToPost(data);
}

/**
 * 글 수정
 */
export async function updatePost(
  id: string,
  updates: Partial<Omit<Post, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Post> {
  const supabase = await createClient();

  const updateData: PostUpdate = {};
  
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.content !== undefined) updateData.content = updates.content;
  if (updates.type !== undefined) updateData.type = updates.type;
  if (updates.thumbnailUrl !== undefined) updateData.thumbnail_url = updates.thumbnailUrl;
  if (updates.isPublished !== undefined) updateData.is_published = updates.isPublished;

  const { data, error } = await supabase
    .from('posts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update post: ${error.message}`);
  }

  return mapPostRowToPost(data);
}

/**
 * 글 삭제
 */
export async function deletePost(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('posts').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete post: ${error.message}`);
  }
}

/**
 * 검색어로 공개된 글 검색 (제목, 설명, 내용에서 검색)
 */
export async function searchPublishedPosts(searchQuery: string): Promise<PostListItem[]> {
  const supabase = await createClient();
  
  if (!searchQuery.trim()) {
    return [];
  }

  // 제목, 설명, 내용에서 검색
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to search posts: ${error.message}`);
  }

  // 각 글의 태그 조회
  const postsWithTags = await Promise.all(
    data.map(async (post) => {
      const { data: postTags } = await supabase
        .from('post_tags')
        .select(`
          tag_id,
          tags(id, name)
        `)
        .eq('post_id', post.id);

      const tags = postTags?.map((pt: any) => ({
        id: pt.tags.id,
        name: pt.tags.name,
      })) || [];

      return {
        ...mapPostRowToPostListItem(post),
        tags,
      };
    })
  );

  return postsWithTags;
}


