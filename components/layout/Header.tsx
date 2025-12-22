import Link from 'next/link';
import { AuthButtons } from './AuthButtons';

export function Header() {
  return (
    <header className="sticky top-0 z-50 h-16 bg-[var(--color-bg-primary)]/80 backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="max-w-[var(--container-max-width)] mx-auto h-full px-[var(--container-padding-x)] flex items-center justify-between">
        <Link
          href="/"
          className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors"
        >
          기술 블로그
        </Link>
        <nav className="flex items-center gap-6 md:gap-8">
          <Link
            href="/"
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors font-medium"
          >
            홈
          </Link>
          <Link
            href="/tags"
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors font-medium hidden sm:inline-block"
          >
            태그
          </Link>
          <Link
            href="/gallery"
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors font-medium hidden sm:inline-block"
          >
            갤러리
          </Link>
          <div className="ml-2 pl-4 border-l border-[var(--color-border)]">
            <AuthButtons />
          </div>
        </nav>
      </div>
    </header>
  );
}

