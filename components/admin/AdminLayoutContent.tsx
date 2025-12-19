'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogoutButton } from '@/components/auth/LogoutButton';

interface AdminLayoutContentProps {
  userEmail: string;
  children: React.ReactNode;
}

export function AdminLayoutContent({ userEmail, children }: AdminLayoutContentProps) {
  const pathname = usePathname();
  const isEditorPage = pathname?.includes('/posts/new') || (pathname?.includes('/posts/') && pathname?.includes('/edit'));

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      {/* 관리자 헤더 */}
      <header className="sticky top-0 z-50 h-16 bg-[var(--color-bg-primary)] border-b border-[var(--color-border)]">
        <div className={`${isEditorPage ? 'w-full px-6' : 'max-w-[var(--container-max-width)] mx-auto px-[var(--container-padding-x)]'} h-full flex items-center justify-between`}>
          <Link
            href="/dashboard"
            className="text-xl font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
          >
            관리자 대시보드
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--color-text-secondary)]">{userEmail}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* 글 작성/수정 페이지는 전체 화면 사용 */}
      {isEditorPage ? (
        <div className="h-[calc(100vh-64px)]">{children}</div>
      ) : (
        <div className="max-w-[var(--container-max-width)] mx-auto px-[var(--container-padding-x)] py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* 사이드바 네비게이션 */}
            <aside className="w-full md:w-64 flex-shrink-0">
              <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-secondary)] rounded-md transition-colors whitespace-nowrap"
                >
                  대시보드
                </Link>
                <Link
                  href="/dashboard/posts"
                  className="block px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-secondary)] rounded-md transition-colors whitespace-nowrap"
                >
                  글 관리
                </Link>
                <Link
                  href="/dashboard/posts/new"
                  className="block px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-secondary)] rounded-md transition-colors whitespace-nowrap"
                >
                  글 작성
                </Link>
                       <Link
                         href="/dashboard/tags"
                         className="block px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-secondary)] rounded-md transition-colors whitespace-nowrap"
                       >
                         태그 목록
                       </Link>
              </nav>
            </aside>

            {/* 메인 콘텐츠 */}
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </div>
      )}
    </div>
  );
}

