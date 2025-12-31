'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { TagBadge } from './TagBadge';
import type { TagWithCount } from '@/lib/supabase/tags';

interface TagCloudProps {
  tags: TagWithCount[];
}

type SortOption = 'popular' | 'name' | 'count';

export function TagCloud({ tags }: TagCloudProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('popular');

  // 검색 필터링
  const filteredTags = useMemo(() => {
    let filtered = tags;

    // 검색어 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((tag) =>
        tag.name.toLowerCase().includes(query)
      );
    }

    // 정렬
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'popular':
          return b.postCount - a.postCount;
        case 'count':
          return a.postCount - b.postCount;
        case 'name':
          return a.name.localeCompare(b.name, 'ko');
        default:
          return 0;
      }
    });

    return sorted;
  }, [tags, searchQuery, sortOption]);

  // 태그 크기 계산 (인기순 기준)
  const maxCount = Math.max(...tags.map((t) => t.postCount), 1);
  const minCount = Math.min(...tags.map((t) => t.postCount), 1);

  const getTagSize = (count: number): 'sm' | 'md' | 'lg' => {
    if (maxCount === minCount) return 'md';
    const ratio = (count - minCount) / (maxCount - minCount);
    if (ratio > 0.7) return 'lg';
    if (ratio > 0.3) return 'md';
    return 'sm';
  };

  // 태그 색상 생성 (해시 기반)
  const getTagColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  return (
    <div className="space-y-6">
      {/* 검색 및 정렬 컨트롤 */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* 검색 입력 */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="태그 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 transition-all"
            aria-label="태그 검색"
          />
        </div>

        {/* 정렬 옵션 */}
        <div className="flex gap-2">
          <button
            onClick={() => setSortOption('popular')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 ${
              sortOption === 'popular'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
            }`}
            aria-label="인기순 정렬"
          >
            인기순
          </button>
          <button
            onClick={() => setSortOption('name')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 ${
              sortOption === 'name'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
            }`}
            aria-label="이름순 정렬"
          >
            이름순
          </button>
          <button
            onClick={() => setSortOption('count')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 ${
              sortOption === 'count'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
            }`}
            aria-label="개수순 정렬"
          >
            개수순
          </button>
        </div>
      </div>

      {/* 태그 개수 표시 */}
      <div className="text-sm text-[var(--color-text-secondary)]">
        총 <span className="font-semibold text-[var(--color-text-primary)]">{filteredTags.length}</span>개의 태그
        {searchQuery && (
          <>
            {' '}
            (검색 결과: <span className="font-semibold text-[var(--color-text-primary)]">{filteredTags.length}</span>개)
          </>
        )}
      </div>

      {/* 태그 클라우드 */}
      {filteredTags.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🏷️</div>
          <p className="text-lg text-[var(--color-text-secondary)] mb-2">
            {searchQuery ? `"${searchQuery}"에 해당하는 태그가 없습니다.` : '태그가 없습니다.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 text-sm text-[var(--color-primary)] hover:underline"
            >
              검색 초기화
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {filteredTags.map((tag, index) => {
            const size = getTagSize(tag.postCount);
            const color = getTagColor(tag.name);
            const sizeClasses = {
              sm: 'text-xs px-2 py-0.5',
              md: 'text-sm px-2.5 py-1',
              lg: 'text-base px-3 py-1.5',
            };
            
            return (
              <Link
                key={tag.id}
                href={`/tags/${encodeURIComponent(tag.name)}`}
                className="inline-block transition-transform hover:scale-105"
              >
                <div
                  className={`inline-flex items-center gap-1 rounded-md transition-all duration-200 ${sizeClasses[size]}`}
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    color: 'var(--color-text-primary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = color;
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                    e.currentTarget.style.color = 'var(--color-text-primary)';
                  }}
                >
                  <span>{tag.name}</span>
                  {tag.postCount > 0 && (
                    <span className="opacity-70">({tag.postCount})</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

