'use client';

import type { TagWithCount } from '@/lib/supabase/tags';

interface TagsManagementProps {
  initialTags: TagWithCount[];
}

export function TagsManagement({ initialTags }: TagsManagementProps) {
  return (
    <div className="space-y-6">
      {/* 안내 메시지 */}
      <div className="bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border)] p-6">
        <p className="text-sm text-[var(--color-text-secondary)]">
          태그는 글 작성 시에만 생성됩니다. 글을 작성할 때 태그를 입력하면 자동으로 생성되며,
          글 삭제 시 연결된 태그도 자동으로 정리됩니다.
        </p>
      </div>

      {/* 태그 목록 (읽기 전용) */}
      <div className="bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border)]">
        <div className="p-6 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            태그 목록 ({initialTags.length})
          </h2>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {initialTags.length === 0 ? (
            <div className="p-6 text-center text-[var(--color-text-secondary)]">
              태그가 없습니다. 글을 작성할 때 태그를 추가해보세요.
            </div>
          ) : (
            initialTags.map((tag) => (
              <div
                key={tag.id}
                className="p-4 flex items-center justify-between hover:bg-[var(--color-bg-secondary)] transition-colors"
              >
                <div className="flex-1">
                  <span className="font-medium text-[var(--color-text-primary)]">
                    {tag.name}
                  </span>
                  <span className="ml-2 text-sm text-[var(--color-text-secondary)]">
                    ({tag.postCount}개 글)
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

