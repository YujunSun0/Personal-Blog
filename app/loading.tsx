export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[var(--color-primary)] border-t-transparent mb-4"></div>
        <p className="text-[var(--color-text-secondary)]">로딩 중...</p>
      </div>
    </div>
  );
}

