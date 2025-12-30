export interface DashboardStats {
  pageViews: number;
  uniqueVisitors: number;
  topPosts: Array<{
    id: string;
    title: string;
    viewCount: number;
  }>;
  dailyStats: Array<{
    date: string;
    pageViews: number;
    uniqueVisitors: number;
  }>;
}

export interface PostStats {
  total: number;
  today: number;
  yesterday: number;
  weeklyStats: Array<{
    date: string;
    views: number;
  }>;
}

export type StatsPeriod = 'day' | 'week' | 'month';

