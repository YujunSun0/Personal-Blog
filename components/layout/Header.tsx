import Link from 'next/link';
import Image from 'next/image';
import { AuthButtons } from './AuthButtons';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 h-16 bg-[var(--color-bg-primary)]/80 backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="mx-auto h-full px-[var(--container-padding-x)] flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 rounded"
          aria-label="홈으로 이동"
        >
          <Image
            src="/images/blog_logo-light.png"
            alt="블로그 로고"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
            priority
          />
          <span className="text-base font-bold text-[var(--color-text-primary)]">
            Yujun Sun | Frontend Developer
          </span>
        </Link>
        <nav className="flex items-center gap-6 md:gap-8" aria-label="주요 네비게이션">
          <Link
            href="/"
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 rounded"
            aria-label="홈 페이지"
          >
            홈
          </Link>
          <Link
            href="/tags"
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors font-medium hidden sm:inline-block focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 rounded"
            aria-label="태그 목록"
          >
            태그
          </Link>
          <Link
            href="/gallery"
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors font-medium hidden sm:inline-block focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 rounded"
            aria-label="갤러리"
          >
            갤러리
          </Link>
          <ThemeToggle />
          <div className="ml-2 pl-4 border-l border-[var(--color-border)]" aria-label="인증 메뉴">
            <AuthButtons />
          </div>
        </nav>
      </div>
    </header>
  );
}

