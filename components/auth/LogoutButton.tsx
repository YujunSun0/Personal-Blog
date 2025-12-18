'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export function LogoutButton() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      toast.success('로그아웃 완료', {
        description: '안전하게 로그아웃되었습니다.',
      });
      router.push('/auth/login');
      router.refresh();
    } else {
      toast.error('로그아웃 실패', {
        description: error.message,
      });
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-xs md:text-sm px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-hover)] transition-colors"
    >
      로그아웃
    </button>
  );
}

