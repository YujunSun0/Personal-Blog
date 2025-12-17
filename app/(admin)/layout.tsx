import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from '@/components/auth/LogoutButton';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* 관리자 헤더 */}
      <header className="sticky top-0 z-50 h-16 bg-[var(--color-bg-primary)] border-b border-[var(--color-border)]">
        <div className="max-w-[var(--container-max-width)] mx-auto h-full px-[var(--container-padding-x)] flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-xl font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
          >
            관리자 대시보드
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--color-text-secondary)]">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

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
                태그 관리
              </Link>
            </nav>
          </aside>

          {/* 메인 콘텐츠 */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}

