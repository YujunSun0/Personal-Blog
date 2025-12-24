import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SignupForm } from '@/components/auth/SignupForm';
import Link from 'next/link';

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 이미 로그인된 경우 대시보드로 리다이렉트
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-secondary)]">
      <div className="max-w-md w-full space-y-8 p-8 bg-[var(--color-bg-primary)] rounded-xl border border-[var(--color-border)] shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-[var(--color-text-primary)]">
            회원가입
          </h2>
        </div>

        <div className="space-y-6">
          <SignupForm />

          <div className="text-center text-sm">
            <span className="text-[var(--color-text-secondary)]">
              이미 계정이 있으신가요?{' '}
            </span>
            <Link
              href="/auth/login"
              className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium"
            >
              로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

