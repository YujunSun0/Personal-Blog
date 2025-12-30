import { getAllCategoriesWithCount } from '@/lib/supabase/categories';
import { CategoriesManagement } from '@/components/admin/CategoriesManagement';

export default async function CategoriesPage() {
  const categories = await getAllCategoriesWithCount();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
          카테고리 관리
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          글의 카테고리를 관리합니다. 카테고리의 slug는 글 작성 시 사용되는 타입과 매핑됩니다.
        </p>
      </div>

      <CategoriesManagement initialCategories={categories} />
    </div>
  );
}

