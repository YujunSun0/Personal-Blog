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
    params.delete('page'); // 페이지 초기화
    router.push(`/?${params.toString()}`);
  };

  // 전체 글 개수 계산
  const totalCount = tags.reduce((sum, tag) => sum + tag.postCount, 0);

  return (
    <div className="space-y-2" role="listbox" aria-label="태그 필터">
      {/* 전체 보기 */}
      <button
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete('tag');
          params.delete('page'); // 페이지 초기화
          router.push(`/?${params.toString()}`);
        }}
        role="option"
        aria-selected={!selectedTag}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all text-left outline-none focus:outline-none focus-visible:outline-none active:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 ${
          !selectedTag
            ? 'bg-[var(--color-primary)] text-white shadow-sm'
            : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
        }`}
      >
        <span>전체</span>
        <span className={`text-xs ${
          !selectedTag ? 'text-white/80' : 'text-[var(--color-text-tertiary)]'
        }`}>
          {totalCount}
        </span>
      </button>

      {/* 태그 목록 */}
      <div className="space-y-1 max-h-[600px] overflow-y-auto" role="listbox">
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => handleTagClick(tag.name)}
            role="option"
            aria-selected={selectedTag === tag.name}
            aria-label={`${tag.name} 태그로 필터링 (${tag.postCount}개 글)`}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-left outline-none focus:outline-none focus-visible:outline-none active:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 ${
              selectedTag === tag.name
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
            }`}
          >
            <span>{tag.name}</span>
            <span className={`text-xs ${
              selectedTag === tag.name ? 'text-white/80' : 'text-[var(--color-text-tertiary)]'
            }`}>
              {tag.postCount}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}



