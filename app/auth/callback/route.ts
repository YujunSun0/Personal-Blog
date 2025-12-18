import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
    
    // 사용자 역할 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      // 관리자인 경우 대시보드로, 일반 사용자는 홈으로 리다이렉트
      if (profile?.role === 'admin') {
        return NextResponse.redirect(`${origin}/dashboard`);
      }
    }
  }

  // 일반 사용자 또는 에러 발생 시 홈으로 리다이렉트
  return NextResponse.redirect(`${origin}/`);
}

