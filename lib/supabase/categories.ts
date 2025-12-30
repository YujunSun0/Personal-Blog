import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';
import type { Category, CategoryListItem } from '@/types/category';

type CategoryRow = Database['public']['Tables']['categories']['Row'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

/**
 * 데이터베이스 Row를 Category 타입으로 변환
 */
function mapCategoryRowToCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    order: row.order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * 모든 카테고리 조회
 */
export async function getAllCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  const categories = data as unknown as CategoryRow[];
  return categories.map(mapCategoryRowToCategory);
}

/**
 * ID로 카테고리 조회
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch category: ${error.message}`);
  }

  const category = data as unknown as CategoryRow;
  return mapCategoryRowToCategory(category);
}

/**
 * Slug로 카테고리 조회
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch category: ${error.message}`);
  }

  const category = data as unknown as CategoryRow;
  return mapCategoryRowToCategory(category);
}

/**
 * 새 카테고리 생성
 */
export async function createCategory(
  category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Category> {
  const supabase = await createClient();

  // order가 없으면 최대값 + 1로 설정
  if (category.order === undefined || category.order === null) {
    const { data: maxOrderData } = await supabase
      .from('categories')
      .select('order')
      .order('order', { ascending: false })
      .limit(1)
      .single();

    const maxOrder = maxOrderData ? (maxOrderData as { order: number }).order : 0;
    category.order = maxOrder + 1;
  }

  const insertData: CategoryInsert = {
    name: category.name.trim(),
    slug: category.slug.trim().toUpperCase(),
    description: category.description?.trim() || null,
    order: category.order,
  };

  const { data, error } = await (supabase
    .from('categories') as unknown as {
      insert: (values: CategoryInsert) => {
        select: () => {
          single: () => Promise<{ data: CategoryRow | null; error: { message: string; code?: string } | null }>;
        };
      };
    })
    .insert(insertData)
    .select()
    .single();

  if (error) {
    // 중복 slug인 경우
    if (error.code === '23505') {
      throw new Error(`이미 존재하는 slug입니다: ${category.slug}`);
    }
    throw new Error(`Failed to create category: ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to create category: 데이터가 없습니다.');
  }

  return mapCategoryRowToCategory(data);
}

/**
 * 카테고리 수정
 */
export async function updateCategory(
  id: string,
  updates: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Category> {
  const supabase = await createClient();

  const updateData: CategoryUpdate = {};
  
  if (updates.name !== undefined) updateData.name = updates.name.trim();
  if (updates.slug !== undefined) updateData.slug = updates.slug.trim().toUpperCase();
  if (updates.description !== undefined) updateData.description = updates.description?.trim() || null;
  if (updates.order !== undefined) updateData.order = updates.order;

  const { data, error } = await (supabase
    .from('categories') as unknown as {
      update: (values: CategoryUpdate) => {
        eq: (column: string, value: string) => {
          select: () => {
            single: () => Promise<{ data: CategoryRow | null; error: { message: string; code?: string } | null }>;
          };
        };
      };
    })
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error(`이미 존재하는 slug입니다: ${updates.slug}`);
    }
    throw new Error(`Failed to update category: ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to update category: 데이터가 없습니다.');
  }

  return mapCategoryRowToCategory(data);
}

/**
 * 카테고리 삭제
 */
export async function deleteCategory(id: string): Promise<void> {
  const supabase = await createClient();

  // 해당 카테고리를 사용하는 글이 있는지 확인
  const category = await getCategoryById(id);
  if (!category) {
    throw new Error('카테고리를 찾을 수 없습니다.');
  }

  const { count, error: checkError } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('type', category.slug);

  if (checkError) {
    throw new Error(`Failed to check category usage: ${checkError.message}`);
  }

  if (count && count > 0) {
    throw new Error('이 카테고리를 사용하는 글이 있어 삭제할 수 없습니다.');
  }

  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete category: ${error.message}`);
  }
}

/**
 * 카테고리별 글 개수와 함께 카테고리 목록 조회
 */
export interface CategoryWithCount extends CategoryListItem {}

export async function getAllCategoriesWithCount(): Promise<CategoryWithCount[]> {
  const supabase = await createClient();

  const categories = await getAllCategories();

  // 각 카테고리별 글 개수 조회
  const categoriesWithCount = await Promise.all(
    categories.map(async (category) => {
      const { count, error } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('type', category.slug);

      if (error) {
        throw new Error(`Failed to count posts for category: ${error.message}`);
      }

      const postCount = count || 0;

      return {
        ...category,
        postCount,
      };
    })
  );

  return categoriesWithCount;
}

/**
 * 공개된 글에 사용된 카테고리만 조회 (글 개수 포함)
 */
export async function getPublishedCategoriesWithCount(): Promise<CategoryWithCount[]> {
  const supabase = await createClient();

  const categories = await getAllCategories();

  // 각 카테고리별 공개된 글 개수 조회
  const categoriesWithCount = await Promise.all(
    categories.map(async (category) => {
      const { count, error } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('type', category.slug)
        .eq('is_published', true);

      if (error) {
        throw new Error(`Failed to count published posts for category: ${error.message}`);
      }

      const postCount = count || 0;

      return {
        ...category,
        postCount,
      };
    })
  );

  // 글 개수가 0개인 카테고리는 제외
  return categoriesWithCount.filter((cat) => cat.postCount > 0);
}

