'use client';

import { useState, useEffect } from 'react';
import { LineChart } from '@/components/charts/LineChart';
import type { DashboardStats, StatsPeriod } from '@/types/stats';

export function DashboardStats() {
  const [period, setPeriod] = useState<StatsPeriod>('day');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/stats/dashboard?period=${period}`);
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [period]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-[var(--color-bg-secondary)] rounded-lg animate-pulse" />
        <div className="h-64 bg-[var(--color-bg-secondary)] rounded-lg animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--color-error-bg)] border border-[var(--color-error)] rounded-lg p-4 text-[var(--color-error)]">
        통계를 불러오는 중 오류가 발생했습니다: {error}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  // 차트 데이터 준비 (페이지뷰와 고유 방문자)
  const chartDataPageViews = stats.dailyStats.map((d) => ({
    date: d.date,
    value: d.pageViews,
  }));

  const chartDataUniqueVisitors = stats.dailyStats.map((d) => ({
    date: d.date,
    value: d.uniqueVisitors,
  }));

  return (
    <div className="space-y-6">
      {/* 기간 필터 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[var(--color-text-secondary)]">기간:</span>
        <div className="flex gap-2">
          {(['day', 'week', 'month'] as StatsPeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                period === p
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
              }`}
            >
              {p === 'day' ? '일' : p === 'week' ? '주' : '월'}
            </button>
          ))}
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 페이지뷰 카드 */}
        <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            페이지뷰
          </h3>
          <p className="text-3xl font-bold text-[var(--color-text-primary)]">
            {stats.pageViews.toLocaleString()}
          </p>
        </div>

        {/* 고유 방문자 카드 */}
        <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            고유 방문자
          </h3>
          <p className="text-3xl font-bold text-[var(--color-text-primary)]">
            {stats.uniqueVisitors.toLocaleString()}
          </p>
        </div>
      </div>

      {/* 일별 통계 차트 */}
      <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
          일별 통계
        </h3>
        <div className="space-y-6">
          {/* 페이지뷰 차트 */}
          <div>
            <h4 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              페이지뷰 추이
            </h4>
            <LineChart
              data={chartDataPageViews}
              width={800}
              height={200}
              color="var(--color-primary)"
            />
          </div>

          {/* 고유 방문자 차트 */}
          <div>
            <h4 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              고유 방문자 추이
            </h4>
            <LineChart
              data={chartDataUniqueVisitors}
              width={800}
              height={200}
              color="var(--color-secondary)"
            />
          </div>
        </div>
      </div>

      {/* 인기 게시글 */}
      {stats.topPosts.length > 0 && (
        <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
            인기 게시글 TOP 10
          </h3>
          <div className="space-y-2">
            {stats.topPosts.map((post, index) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-3 bg-[var(--color-bg-secondary)] rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[var(--color-text-tertiary)] w-6">
                    {index + 1}
                  </span>
                  <span className="text-sm text-[var(--color-text-primary)]">
                    {post.title}
                  </span>
                </div>
                <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                  {post.viewCount.toLocaleString()}회
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

