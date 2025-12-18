import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';
import type { Tag } from '@/types/tag';

type TagRow = Database['public']['Tables']['tags']['Row'];
type TagInsert = Database['public']['Tables']['tags']['Insert'];
type TagUpdate = Database['public']['Tables']['tags']['Update'];

/**
 * 데이터베이스 Row를 Tag 타입으로 변환
 */
function mapTagRowToTag(row: TagRow): Tag {
  return {
    id: row.id,
    name: row.name,
  };
}

/**
 * 모든 태그 조회
 */
export async function getAllTags(): Promise<Tag[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch tags: ${error.message}`);
  }

  return data.map(mapTagRowToTag);
}

/**
 * ID로 태그 조회
 */
export async function getTagById(id: string): Promise<Tag | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch tag: ${error.message}`);
  }

  return mapTagRowToTag(data);
}

/**
 * 이름으로 태그 조회
 */
export async function getTagByName(name: string): Promise<Tag | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('name', name)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch tag: ${error.message}`);
  }

  return mapTagRowToTag(data);
}

/**
 * 새 태그 생성
 */
export async function createTag(name: string): Promise<Tag> {
  const supabase = await createClient();

  const insertData: TagInsert = {
    name: name.trim(),
  };

  const { data, error } = await supabase
    .from('tags')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    // 중복 태그인 경우 기존 태그 반환
    if (error.code === '23505') {
      const existingTag = await getTagByName(name.trim());
      if (existingTag) {
        return existingTag;
      }
    }
    throw new Error(`Failed to create tag: ${error.message}`);
  }

  return mapTagRowToTag(data);
}

/**
 * 태그 수정
 */
export async function updateTag(id: string, name: string): Promise<Tag> {
  const supabase = await createClient();

  const updateData: TagUpdate = {
    name: name.trim(),
  };

  const { data, error } = await supabase
    .from('tags')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update tag: ${error.message}`);
  }

  return mapTagRowToTag(data);
}

/**
 * 태그 삭제
 */
export async function deleteTag(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('tags').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete tag: ${error.message}`);
  }
}

/**
 * 태그별 글 개수와 함께 태그 목록 조회
 */
export interface TagWithCount extends Tag {
  postCount: number;
}

export async function getAllTagsWithCount(): Promise<TagWithCount[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tags')
    .select(`
      *,
      post_tags(count)
    `)
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch tags with count: ${error.message}`);
  }

  return data.map((tag) => ({
    id: tag.id,
    name: tag.name,
    postCount: Array.isArray(tag.post_tags) ? tag.post_tags.length : 0,
  }));
}

/**
 * 공개된 글에 연결된 태그만 조회 (글 개수 포함)
 */
export async function getPublishedTagsWithCount(): Promise<TagWithCount[]> {
  const supabase = await createClient();

  // 공개된 글의 ID 조회
  const { data: publishedPosts, error: postsError } = await supabase
    .from('posts')
    .select('id')
    .eq('is_published', true);

  if (postsError) {
    throw new Error(`Failed to fetch published posts: ${postsError.message}`);
  }

  const publishedPostIds = publishedPosts.map((p) => p.id);

  if (publishedPostIds.length === 0) {
    return [];
  }

  // 공개된 글에 연결된 태그 조회
  const { data: postTags, error: postTagsError } = await supabase
    .from('post_tags')
    .select('tag_id')
    .in('post_id', publishedPostIds);

  if (postTagsError) {
    throw new Error(`Failed to fetch post tags: ${postTagsError.message}`);
  }

  // 태그별 개수 집계
  const tagCountMap = new Map<string, number>();
  postTags.forEach((pt) => {
    const count = tagCountMap.get(pt.tag_id) || 0;
    tagCountMap.set(pt.tag_id, count + 1);
  });

  // 태그 정보 조회
  const tagIds = Array.from(tagCountMap.keys());
  if (tagIds.length === 0) {
    return [];
  }

  const { data: tags, error: tagsError } = await supabase
    .from('tags')
    .select('*')
    .in('id', tagIds)
    .order('name', { ascending: true });

  if (tagsError) {
    throw new Error(`Failed to fetch tags: ${tagsError.message}`);
  }

  return tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    postCount: tagCountMap.get(tag.id) || 0,
  }));
}

/**
 * 글에 연결된 태그 조회
 */
export async function getTagsByPostId(postId: string): Promise<Tag[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('post_tags')
    .select(`
      tag_id,
      tags(*)
    `)
    .eq('post_id', postId);

  if (error) {
    throw new Error(`Failed to fetch tags for post: ${error.message}`);
  }

  return data.map((item: any) => mapTagRowToTag(item.tags));
}

/**
 * 글에 태그 연결
 */
export async function connectPostToTag(postId: string, tagId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('post_tags')
    .insert({
      post_id: postId,
      tag_id: tagId,
    });

  if (error) {
    // 이미 연결되어 있는 경우 무시
    if (error.code === '23505') {
      return;
    }
    throw new Error(`Failed to connect post to tag: ${error.message}`);
  }
}

/**
 * 글에서 태그 연결 해제
 */
export async function disconnectPostFromTag(postId: string, tagId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('post_tags')
    .delete()
    .eq('post_id', postId)
    .eq('tag_id', tagId);

  if (error) {
    throw new Error(`Failed to disconnect post from tag: ${error.message}`);
  }
}

/**
 * 글의 모든 태그 연결 해제
 */
export async function disconnectAllTagsFromPost(postId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('post_tags')
    .delete()
    .eq('post_id', postId);

  if (error) {
    throw new Error(`Failed to disconnect all tags from post: ${error.message}`);
  }
}

/**
 * 태그 이름 배열로 태그 ID 배열 반환 (없으면 생성)
 */
export async function getOrCreateTags(tagNames: string[]): Promise<string[]> {
  const tagIds: string[] = [];

  for (const name of tagNames) {
    const trimmedName = name.trim();
    if (!trimmedName) continue;

    let tag = await getTagByName(trimmedName);
    if (!tag) {
      tag = await createTag(trimmedName);
    }
    tagIds.push(tag.id);
  }

  return tagIds;
}

/**
 * 글에 태그 연결 (태그 이름 배열로)
 */
export async function connectPostToTags(postId: string, tagNames: string[]): Promise<void> {
  // 기존 태그 연결 해제
  await disconnectAllTagsFromPost(postId);

  // 태그 ID 배열 가져오기 (없으면 생성)
  const tagIds = await getOrCreateTags(tagNames);

  // 새 태그 연결
  for (const tagId of tagIds) {
    await connectPostToTag(postId, tagId);
  }
}

