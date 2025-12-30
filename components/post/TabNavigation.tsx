'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { PostType } from '@/types/post';

interface TabNavigationProps {
  typeCounts?: {
    TECH: number;
    TROUBLESHOOTING: number;
    // PROJECT: number;
    PROJECT: number;
    total: number;
  };
}

const TYPE_LABELS: Record<PostType, string> = {
  TECH: '개발',
  TROUBLESHOOTING: '트러블슈팅',
  PROJECT: '프로젝트',
};

export function TabNavigation({ typeCounts }: TabNavigationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedType = searchParams.get('type') as PostType | null;

  const handleTabClick = (type: PostType | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type) {
      params.set('type', type);
    } else {
      params.delete('type');
    }
    params.delete('page'); // 페이지 초기화
    router.push(`/?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent, type: PostType | null) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTabClick(type);
    }
  };

  return (
    <nav className="border-b border-[var(--color-border)] mb-8" aria-label="글 타입 필터">
      <div className="flex gap-8 overflow-x-auto" role="tablist">
        {/* 전체 탭 */}
        <button
          onClick={() => handleTabClick(null)}
          onKeyDown={(e) => handleKeyDown(e, null)}
          role="tab"
          aria-selected={!selectedType}
          aria-controls="post-list"
          className={`pb-4 px-1 text-base font-medium transition-colors whitespace-nowrap border-b-2 outline-none focus:outline-none focus-visible:outline-none active:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 rounded-t ${
            !selectedType
              ? 'text-[var(--color-text-primary)] border-[var(--color-text-primary)]'
              : 'text-[var(--color-text-secondary)] border-transparent hover:text-[var(--color-text-primary)]'
          }`}
        >
          전체{typeCounts ? ` (${typeCounts.total})` : ''}
        </button>

        {/* 타입 탭들 */}
        {(['TECH', 'TROUBLESHOOTING', 'PROJECT'] as PostType[]).map((type) => (
          <button
            key={type}
            onClick={() => handleTabClick(type)}
            onKeyDown={(e) => handleKeyDown(e, type)}
            role="tab"
            aria-selected={selectedType === type}
            aria-controls="post-list"
            className={`pb-4 px-1 text-base font-medium transition-colors whitespace-nowrap border-b-2 outline-none focus:outline-none focus-visible:outline-none active:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 rounded-t ${
              selectedType === type
                ? 'text-[var(--color-text-primary)] border-[var(--color-text-primary)]'
                : 'text-[var(--color-text-secondary)] border-transparent hover:text-[var(--color-text-primary)]'
            }`}
          >
            {TYPE_LABELS[type]}
            {typeCounts ? ` (${typeCounts[type]})` : ''}
          </button>
        ))}
      </div>
    </nav>
  );
}

