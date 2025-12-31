import { createClient } from '@/lib/supabase/server';
import type { DashboardStats, PostStats, StatsPeriod } from '@/types/stats';
import type { Database } from './types';

type PostRow = Database['public']['Tables']['posts']['Row'];
type PostViewsRow = Database['public']['Tables']['post_views']['Row'];

/**
 * 기간에 따른 시작일과 종료일 계산
 */
function getPeriodDates(period: StatsPeriod): { startDate: Date; endDate: Date } {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999); // 오늘 끝

  const startDate = new Date();
  
  switch (period) {
    case 'day':
      startDate.setHours(0, 0, 0, 0); // 오늘 시작
      break;
    case 'week':
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'month':
      startDate.setDate(startDate.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
      break;
  }

  return { startDate, endDate };
}

/**
 * 관리자 대시보드 통계 조회
 */
export async function getDashboardStats(period: StatsPeriod): Promise<DashboardStats> {
  const supabase = await createClient();
  const { startDate, endDate } = getPeriodDates(period);

  const startDateStr = startDate.toISOString();
  const endDateStr = endDate.toISOString();

  // 전체 페이지뷰 수
  const { count: pageViews, error: pageViewsError } = await supabase
    .from('post_views')
    .select('*', { count: 'exact', head: true })
    .gte('viewed_at', startDateStr)
    .lte('viewed_at', endDateStr);

  if (pageViewsError) {
    throw new Error(`Failed to fetch page views: ${pageViewsError.message}`);
  }

  // 전체 고유 방문자 수
  const { data: uniqueVisitorsData, error: uniqueVisitorsError } = await supabase
    .from('post_views')
    .select('cookie_id')
    .gte('viewed_at', startDateStr)
    .lte('viewed_at', endDateStr);

  if (uniqueVisitorsError) {
    throw new Error(`Failed to fetch unique visitors: ${uniqueVisitorsError.message}`);
  }

  const uniqueVisitorsSet = new Set(
    (uniqueVisitorsData || [])
      .map((v) => (v as Pick<PostViewsRow, 'cookie_id'>).cookie_id)
      .filter((id): id is string => id !== null)
  );
  const uniqueVisitors = uniqueVisitorsSet.size;

  // 일별 통계
  const { data: dailyData, error: dailyError } = await supabase
    .from('post_views')
    .select('viewed_at, cookie_id')
    .gte('viewed_at', startDateStr)
    .lte('viewed_at', endDateStr)
    .order('viewed_at', { ascending: true });

  if (dailyError) {
    throw new Error(`Failed to fetch daily stats: ${dailyError.message}`);
  }

  // 일별로 그룹화
  const dailyStatsMap = new Map<string, { pageViews: number; uniqueVisitors: Set<string> }>();

  (dailyData || []).forEach((view) => {
    const viewData = view as Pick<PostViewsRow, 'viewed_at' | 'cookie_id'>;
    const date = new Date(viewData.viewed_at).toISOString().split('T')[0]; // YYYY-MM-DD

    if (!dailyStatsMap.has(date)) {
      dailyStatsMap.set(date, { pageViews: 0, uniqueVisitors: new Set() });
    }

    const dayStats = dailyStatsMap.get(date)!;
    dayStats.pageViews += 1;
    if (viewData.cookie_id) {
      dayStats.uniqueVisitors.add(viewData.cookie_id);
    }
  });

  // 날짜 순으로 정렬하여 배열로 변환
  const dailyStats = Array.from(dailyStatsMap.entries())
    .map(([date, stats]) => ({
      date,
      pageViews: stats.pageViews,
      uniqueVisitors: stats.uniqueVisitors.size,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // 인기 게시글 TOP 10
  const { data: topPostsData, error: topPostsError } = await supabase
    .from('post_views')
    .select('post_id')
    .gte('viewed_at', startDateStr)
    .lte('viewed_at', endDateStr);

  if (topPostsError) {
    throw new Error(`Failed to fetch top posts: ${topPostsError.message}`);
  }

  // 게시글별 조회수 집계
  const postViewCounts = new Map<string, number>();
  (topPostsData || []).forEach((view) => {
    const viewData = view as Pick<PostViewsRow, 'post_id'>;
    const count = postViewCounts.get(viewData.post_id) || 0;
    postViewCounts.set(viewData.post_id, count + 1);
  });

  // 조회수 순으로 정렬하고 TOP 10 선택
  const topPostIds = Array.from(postViewCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([postId]) => postId);

  // 게시글 정보 조회
  const topPosts: DashboardStats['topPosts'] = [];
  if (topPostIds.length > 0) {
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('id, title, view_count')
      .in('id', topPostIds);

    if (postsError) {
      throw new Error(`Failed to fetch top posts details: ${postsError.message}`);
    }

    const posts = (postsData || []) as Array<Pick<PostRow, 'id' | 'title' | 'view_count'>>;
    
    // 조회수 순으로 정렬
    topPosts.push(
      ...posts
        .map((post) => ({
          id: post.id,
          title: post.title,
          viewCount: post.view_count || 0,
        }))
        .sort((a, b) => b.viewCount - a.viewCount)
    );
  }

  return {
    pageViews: pageViews || 0,
    uniqueVisitors,
    topPosts,
    dailyStats,
  };
}

/**
 * 게시글별 통계 조회
 */
export async function getPostStats(postId: string): Promise<PostStats> {
  const supabase = await createClient();

  // 오늘 날짜 (00:00:00)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 어제 날짜 (00:00:00) 
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // 오늘 끝 (23:59:59)
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);

  // 어제 끝 (23:59:59)
  const yesterdayEnd = new Date(yesterday);
  yesterdayEnd.setHours(23, 59, 59, 999);

  // 최근 7일 전 날짜 (오늘 포함 7일 = 6일 전부터 오늘까지)
  const sixDaysAgo = new Date(today);
  sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
  sixDaysAgo.setHours(0, 0, 0, 0);

  // 전체 조회수
  const { count: total, error: totalError } = await supabase
    .from('post_views')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);

  if (totalError) {
    throw new Error(`Failed to fetch total views: ${totalError.message}`);
  }

  // 오늘 조회수
  const { count: todayCount, error: todayError } = await supabase
    .from('post_views')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId)
    .gte('viewed_at', today.toISOString())
    .lte('viewed_at', todayEnd.toISOString());

  if (todayError) {
    throw new Error(`Failed to fetch today views: ${todayError.message}`);
  }

  // 어제 조회수
  const { count: yesterdayCount, error: yesterdayError } = await supabase
    .from('post_views')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId)
    .gte('viewed_at', yesterday.toISOString())
    .lte('viewed_at', yesterdayEnd.toISOString());

  if (yesterdayError) {
    throw new Error(`Failed to fetch yesterday views: ${yesterdayError.message}`);
  }

  // 최근 7일 일별 조회수 (6일 전부터 오늘까지)
  const { data: weeklyData, error: weeklyError } = await supabase
    .from('post_views')
    .select('viewed_at')
    .eq('post_id', postId)
    .gte('viewed_at', sixDaysAgo.toISOString())
    .lte('viewed_at', todayEnd.toISOString())
    .order('viewed_at', { ascending: true });

  if (weeklyError) {
    throw new Error(`Failed to fetch weekly stats: ${weeklyError.message}`);
  }

  // 날짜를 YYYY-MM-DD 형식으로 변환 (로컬 시간 기준)
  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 일별로 그룹화
  const weeklyStatsMap = new Map<string, number>();
  (weeklyData || []).forEach((view) => {
    const viewData = view as Pick<PostViewsRow, 'viewed_at'>;
    // UTC 시간을 로컬 시간으로 변환 후 날짜 추출
    const viewDate = new Date(viewData.viewed_at);
    const dateStr = formatDateString(viewDate);
    const count = weeklyStatsMap.get(dateStr) || 0;
    weeklyStatsMap.set(dateStr, count + 1);
  });

  // 최근 7일 날짜 배열 생성 (6일 전부터 오늘까지, 오늘 포함)
  const weeklyStats: PostStats['weeklyStats'] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = formatDateString(date);
    weeklyStats.push({
      date: dateStr,
      views: weeklyStatsMap.get(dateStr) || 0,
    });
  }

  return {
    total: total || 0,
    today: todayCount || 0,
    yesterday: yesterdayCount || 0,
    weeklyStats,
  };
}

