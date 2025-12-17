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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
            <p className="mt-2 text-gray-600">
              환영합니다, {user.email}님!
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              글 관리
            </h2>
            <p className="text-gray-600 text-sm">
              글 작성, 수정, 삭제를 관리할 수 있습니다.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              태그 관리
            </h2>
            <p className="text-gray-600 text-sm">
              태그를 생성하고 관리할 수 있습니다.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              댓글 관리
            </h2>
            <p className="text-gray-600 text-sm">
              댓글을 확인하고 관리할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

