import { getAllTagsWithCount } from '@/lib/supabase/tags';
import { TagsManagement } from '@/components/admin/TagsManagement';

export default async function TagsPage() {
  const tags = await getAllTagsWithCount();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
          태그 관리
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          태그를 생성하고 관리할 수 있습니다.
        </p>
      </div>

      <TagsManagement initialTags={tags} />
    </div>
  );
}

