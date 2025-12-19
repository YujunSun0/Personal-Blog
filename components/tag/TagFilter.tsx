'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { TagWithCount } from '@/lib/supabase/tags';
import { TagBadge } from './TagBadge';

interface TagFilterProps {
  tags: TagWithCount[];
}

export function TagFilter({ tags }: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get('tag');

  const handleTagClick = (tagName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedTag === tagName) {
      // 같은 태그 클릭 시 필터 제거
      params.delete('tag');
    } else {
      // 다른 태그 선택
      params.set('tag', tagName);
    }
    router.push(`/?${params.toString()}`);
  };

  // 전체 글 개수 계산
  const totalCount = tags.reduce((sum, tag) => sum + tag.postCount, 0);

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        {/* 전체 보기 */}
        <button
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('tag');
            router.push(`/?${params.toString()}`);
          }}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            !selectedTag
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
          }`}
        >
          전체보기 ({totalCount})
        </button>

        {/* 태그 목록 */}
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => handleTagClick(tag.name)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTag === tag.name
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
            }`}
          >
            {tag.name} ({tag.postCount})
          </button>
        ))}
      </div>
    </div>
  );
}



