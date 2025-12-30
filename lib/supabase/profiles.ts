import { createClient } from './server';
import type { UserRole } from '@/types/profile';
import type { Database } from './types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

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

  const profile = data as ProfileRow;

  return {
    id: profile.id,
    userId: profile.user_id,
    nickname: profile.nickname,
    role: profile.role as UserRole,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
}

/**
 * 사용자가 관리자인지 확인
 * @param userId - 확인할 사용자 ID (없으면 현재 로그인한 사용자)
 */
export async function isAdmin(userId?: string): Promise<boolean> {
  if (userId) {
    // 특정 사용자 ID로 확인
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return false;
    }

    const profile = data as Pick<ProfileRow, 'role'>;
    return profile.role === 'admin';
  }

  // 현재 로그인한 사용자 확인
  const profile = await getCurrentUserProfile();
  return profile?.role === 'admin';
}

