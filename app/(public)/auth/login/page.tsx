import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { LoginForm } from '@/components/auth/LoginForm';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 이미 로그인된 경우 역할에 따라 리다이렉트
  if (user) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!error && profile) {
      const role = (profile as { role: 'user' | 'admin' }).role;
      if (role === 'admin') {
        redirect('/dashboard');
        return;
      }
    }
    redirect('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-secondary)]">
      <div className="max-w-md w-full space-y-8 p-8 bg-[var(--color-bg-primary)] rounded-xl border border-[var(--color-border)] shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-[var(--color-text-primary)]">
            로그인
          </h2>
        </div>

        <div className="space-y-6">
          <LoginForm />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-border)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)]">
                또는
              </span>
            </div>
          </div>

          <SocialLoginButtons />

          <div className="text-center text-sm">
            <span className="text-[var(--color-text-secondary)]">
              계정이 없으신가요?{' '}
            </span>
            <Link
              href="/auth/signup"
              className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium"
            >
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

