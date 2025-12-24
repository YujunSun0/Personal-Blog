import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminLayoutContent } from '@/components/admin/AdminLayoutContent';
import { UserRole } from '@/types/profile';

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
    redirect('/auth/login');
  }

  // 관리자 권한 확인
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (!profile || (profile as { role: UserRole }).role !== 'admin') {
    redirect('/');
  }

  return <AdminLayoutContent userEmail={user.user_metadata.name || ''}>{children}</AdminLayoutContent>;
}

