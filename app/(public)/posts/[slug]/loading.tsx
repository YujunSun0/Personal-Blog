export default function PostLoading() {
  return (
    <article className="max-w-[var(--container-max-width)] mx-auto px-[var(--container-padding-x)] py-8">
      {/* 헤더 스켈레톤 */}
      <div className="mb-8 space-y-4">
        <div className="h-12 bg-[var(--color-bg-secondary)] rounded w-3/4 animate-pulse" />
        <div className="flex items-center gap-4">
          <div className="h-6 w-24 bg-[var(--color-bg-secondary)] rounded-full animate-pulse" />
          <div className="h-4 w-32 bg-[var(--color-bg-secondary)] rounded animate-pulse" />
        </div>
      </div>

      {/* 태그 스켈레톤 */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-6 w-20 bg-[var(--color-bg-secondary)] rounded-full animate-pulse"
          />
        ))}
      </div>

      {/* 콘텐츠 스켈레톤 */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-[var(--color-bg-secondary)] rounded w-full animate-pulse" />
            <div className="h-4 bg-[var(--color-bg-secondary)] rounded w-5/6 animate-pulse" />
          </div>
        ))}
        <div className="h-64 bg-[var(--color-bg-secondary)] rounded-lg animate-pulse mt-6" />
      </div>

      {/* 댓글 스켈레톤 */}
      <div className="mt-12 space-y-4">
        <div className="h-8 bg-[var(--color-bg-secondary)] rounded w-32 animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 border border-[var(--color-border)] rounded-lg space-y-2"
          >
            <div className="h-4 w-24 bg-[var(--color-bg-secondary)] rounded animate-pulse" />
            <div className="h-4 bg-[var(--color-bg-secondary)] rounded w-full animate-pulse" />
            <div className="h-4 bg-[var(--color-bg-secondary)] rounded w-3/4 animate-pulse" />
          </div>
        ))}
      </div>
    </article>
  );
}

