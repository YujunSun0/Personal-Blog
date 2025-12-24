'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { LogoutButton } from '@/components/auth/LogoutButton';

export function UserMenu() {
  const { user, loading, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (loading) {
    return (
      <div className="w-8 h-8 bg-[var(--color-bg-secondary)] rounded-full animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="text-xs md:text-sm px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-hover)] transition-colors"
      >
        로그인
      </Link>
    );
  }

  // 사용자 이름의 첫 글자 또는 이니셜
  const userInitial = user.user_metadata?.name
    ? user.user_metadata.name.charAt(0).toUpperCase()
    : user.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="relative" ref={menuRef}>
      {/* 프로필 아이콘 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
        aria-label="사용자 메뉴"
        aria-expanded={isOpen}
      >
        {userInitial}
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg shadow-lg py-2 z-50">
          {/* 사용자 정보 */}
          <div className="px-4 py-2 border-b border-[var(--color-border)]">
            <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
              {user.user_metadata?.name || user.email}
            </p>
            {user.email && (
              <p className="text-xs text-[var(--color-text-secondary)] truncate mt-1">
                {user.email}
              </p>
            )}
          </div>

          {/* 메뉴 항목 */}
          <div className="py-1">
            {isAdmin && (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
              >
                관리자 대시보드
              </Link>
            )}
            <div className="px-4 py-2">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

