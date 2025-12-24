'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { LogoutButton } from '@/components/auth/LogoutButton';

export function AuthButtons() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-16 h-8 bg-[var(--color-bg-secondary)] rounded animate-pulse" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        {isAdmin && (
          <Link
            href="/dashboard"
            className="text-xs md:text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
          >
            관리자
          </Link>
        )}
        <span className="text-xs md:text-sm text-[var(--color-text-secondary)] hidden sm:inline-block">
          {user.email}
        </span>
        <LogoutButton />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/auth/login"
        className="text-xs md:text-sm px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-hover)] transition-colors"
      >
        로그인
      </Link>
    </div>
  );
}

