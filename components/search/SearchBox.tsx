'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getSearchHistory, addSearchHistory, removeSearchHistory } from '@/lib/utils/searchHistory';
import type { TagWithCount } from '@/lib/supabase/tags';

// 아이콘 컴포넌트
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const HashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
  </svg>
);

export function SearchBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 최근 검색어 로드
  useEffect(() => {
    const history = getSearchHistory();
    setRecentSearches(history.map(item => item.query));
  }, []);

  // 태그 로드
  useEffect(() => {
    if (isOpen) {
      setIsLoadingTags(true);
      fetch('/api/tags/public')
        .then(res => res.json())
        .then(data => {
          setTags(data || []);
        })
        .catch(error => {
          console.error('Failed to fetch tags:', error);
          setTags([]);
        })
        .finally(() => {
          setIsLoadingTags(false);
        });
    }
  }, [isOpen]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSearch = (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    // 검색 기록 추가
    addSearchHistory(trimmedQuery);
    
    // 검색 결과 페이지로 이동
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleTagClick = (tagName: string) => {
    handleSearch(tagName);
  };

  const handleRemoveRecent = (e: React.MouseEvent, searchQuery: string) => {
    e.stopPropagation();
    removeSearchHistory(searchQuery);
    const history = getSearchHistory();
    setRecentSearches(history.map(item => item.query));
  };

  return (
    <div ref={searchRef} className="relative">
      {/* 검색 입력창 */}
      <div className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-3 text-[var(--color-text-tertiary)]">
            <SearchIcon />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="검색..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className="w-64 pl-10 pr-10 py-2 text-sm bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="absolute right-2 p-1 hover:bg-[var(--color-bg-tertiary)] rounded transition-colors"
              aria-label="검색어 지우기"
            >
              <XIcon />
            </button>
          )}
        </div>
      </div>

      {/* 검색 드롭다운 */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 max-h-[500px] overflow-y-auto">
          {/* 최근 검색어 */}
          {recentSearches.length > 0 && (
            <div className="p-4 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2 mb-3">
                <div className="text-[var(--color-text-tertiary)]">
                  <ClockIcon />
                </div>
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                  최근 검색어
                </h3>
              </div>
              <div className="space-y-1">
                {recentSearches.map((searchQuery, index) => (
                  <div
                    key={index}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded transition-colors group"
                  >
                    <button
                      onClick={() => handleSearch(searchQuery)}
                      className="flex-1 text-left truncate"
                    >
                      {searchQuery}
                    </button>
                    <button
                      onClick={(e) => handleRemoveRecent(e, searchQuery)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[var(--color-bg-tertiary)] rounded transition-all ml-2"
                      aria-label="검색어 삭제"
                    >
                      <XIcon />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 태그 목록 */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
                <div className="text-[var(--color-text-tertiary)]">
                  <HashIcon />
                </div>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                인기 태그
              </h3>
            </div>
            {isLoadingTags ? (
              <div className="text-sm text-[var(--color-text-tertiary)] py-4 text-center">
                로딩 중...
              </div>
            ) : tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagClick(tag.name)}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded transition-colors"
                  >
                    <HashIcon />
                    {tag.name}
                    {tag.postCount > 0 && (
                      <span className="text-[var(--color-text-tertiary)]">
                        ({tag.postCount})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-sm text-[var(--color-text-tertiary)] py-4 text-center">
                태그가 없습니다
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

