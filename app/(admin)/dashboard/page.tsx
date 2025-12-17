import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from '@/components/auth/LogoutButton';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
          대시보드
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          환영합니다, {user.email}님!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border)] p-6 hover:border-[var(--color-border-hover)] transition-colors">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
            글 관리
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm">
            글 작성, 수정, 삭제를 관리할 수 있습니다.
          </p>
        </div>

        <div className="bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border)] p-6 hover:border-[var(--color-border-hover)] transition-colors">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
            태그 관리
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm">
            태그를 생성하고 관리할 수 있습니다.
          </p>
        </div>

        <div className="bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border)] p-6 hover:border-[var(--color-border-hover)] transition-colors">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
            댓글 관리
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm">
            댓글을 확인하고 관리할 수 있습니다.
          </p>
        </div>
      </div>
    </>
  );
}

