import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getDashboardStats } from '@/lib/supabase/stats';
import type { StatsPeriod } from '@/types/stats';

/**
 * 관리자 대시보드 통계 API
 * GET /api/stats/dashboard?period=day|week|month
 */
export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 관리자 권한 확인
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!profile || (profile as { role: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 쿼리 파라미터에서 period 가져오기
    const { searchParams } = new URL(request.url);
    const periodParam = searchParams.get('period') || 'day';
    const period: StatsPeriod = ['day', 'week', 'month'].includes(periodParam)
      ? (periodParam as StatsPeriod)
      : 'day';

    // 통계 조회
    const stats = await getDashboardStats(period);

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch dashboard stats',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

