import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-8">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors font-medium"
          >
            홈으로 돌아가기
          </Link>
          <Link
            href="/gallery"
            className="px-6 py-3 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors font-medium border border-[var(--color-border)]"
          >
            갤러리 보기
          </Link>
        </div>
      </div>
    </div>
  );
}

