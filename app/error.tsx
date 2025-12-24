'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅 (선택사항)
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">
            문제가 발생했습니다
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-2">
            예상치 못한 오류가 발생했습니다.
          </p>
          {error.message && (
            <p className="text-sm text-[var(--color-text-tertiary)] mt-4 p-4 bg-[var(--color-bg-secondary)] rounded-lg">
              {error.message}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors font-medium"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors font-medium border border-[var(--color-border)]"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

