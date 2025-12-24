export default function PublicLoading() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <div className="max-w-[var(--container-max-width)] mx-auto px-[var(--container-padding-x)] py-12">
        {/* 탭 스켈레톤 */}
        <div className="flex gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-10 w-24 bg-[var(--color-bg-secondary)] rounded-lg animate-pulse"
            />
          ))}
        </div>

        {/* 게시글 목록 스켈레톤 */}
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex flex-col-reverse md:flex-row gap-6 py-6 border-b border-[var(--color-border)]"
            >
              {/* 콘텐츠 영역 */}
              <div className="flex-1 space-y-3">
                <div className="h-8 bg-[var(--color-bg-secondary)] rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-[var(--color-bg-secondary)] rounded w-full animate-pulse" />
                <div className="h-4 bg-[var(--color-bg-secondary)] rounded w-2/3 animate-pulse" />
                <div className="flex gap-2 mt-4">
                  <div className="h-6 w-16 bg-[var(--color-bg-secondary)] rounded-full animate-pulse" />
                  <div className="h-6 w-20 bg-[var(--color-bg-secondary)] rounded-full animate-pulse" />
                </div>
              </div>
              {/* 썸네일 영역 */}
              <div className="flex-shrink-0 w-32 md:w-40 h-24 md:h-28 bg-[var(--color-bg-secondary)] rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

