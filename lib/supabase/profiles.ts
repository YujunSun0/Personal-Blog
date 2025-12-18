import { createClient } from './server';
import type { UserRole } from '@/types/profile';

/**
 * 현재 로그인한 사용자의 프로필 조회
 */
export async function getCurrentUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    userId: data.user_id,
    nickname: data.nickname,
    role: data.role as UserRole,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

/**
 * 사용자가 관리자인지 확인
 */
export async function isAdmin(): Promise<boolean> {
  const profile = await getCurrentUserProfile();
  return profile?.role === 'admin';
}

