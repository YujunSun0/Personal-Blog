import { getAllTagsWithCount } from '@/lib/supabase/tags';
import { TagsManagement } from '@/components/admin/TagsManagement';

export default async function TagsPage() {
  const tags = await getAllTagsWithCount();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
          태그 목록
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          현재 사용 중인 태그 목록입니다. 태그는 글 작성 시에만 생성됩니다.
        </p>
      </div>

      <TagsManagement initialTags={tags} />
    </div>
  );
}

