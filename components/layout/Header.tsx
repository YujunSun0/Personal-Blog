import Link from 'next/link';
import { AuthButtons } from './AuthButtons';

export function Header() {
  return (
    <header className="sticky top-0 z-50 h-16 bg-[var(--color-bg-primary)] border-b border-[var(--color-border)]">
      <div className="max-w-[var(--container-max-width)] mx-auto h-full px-[var(--container-padding-x)] flex items-center justify-between">
        <Link
          href="/"
          className="text-xl md:text-2xl font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
        >
          기술 블로그
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          <Link
            href="/"
            className="text-xs md:text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
          >
            홈
          </Link>
          <Link
            href="/about"
            className="text-xs md:text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors hidden sm:inline-block"
          >
            소개
          </Link>
          <Link
            href="/tags"
            className="text-xs md:text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
          >
            태그
          </Link>
          <button
            className="text-xs md:text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors bg-transparent border-none cursor-pointer"
            aria-label="다크모드 토글"
          >
            🌙
          </button>
          <div className="ml-2 pl-4">
            <AuthButtons />
          </div>
        </nav>
      </div>
    </header>
  );
}

