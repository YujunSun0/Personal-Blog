'use client';

import { useEffect, useState } from 'react';
import { LineChart } from '@/components/charts/LineChart';
import type { PostStats } from '@/types/stats';

interface PostStatsProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function PostStats({ postId, isOpen, onClose }: PostStatsProps) {
  const [stats, setStats] = useState<PostStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/posts/${postId}/stats`);
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
  }, [postId, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* 오버레이 배경 */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* 통계 모달 */}
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[90vw] md:max-w-4xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg shadow-xl z-50 overflow-y-auto max-h-[90vh]">
        <div className="sticky top-0 bg-[var(--color-bg-primary)] border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            조회수 통계
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
            aria-label="닫기"
          >
            <svg
              className="w-5 h-5 text-[var(--color-text-secondary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {loading ? (
            <div className="space-y-4">
              <div className="h-24 bg-[var(--color-bg-secondary)] rounded-lg animate-pulse" />
              <div className="h-64 bg-[var(--color-bg-secondary)] rounded-lg animate-pulse" />
            </div>
          ) : error ? (
            <div className="bg-[var(--color-error-bg)] border border-[var(--color-error)] rounded-lg p-4 text-[var(--color-error)] text-sm">
              통계를 불러오는 중 오류가 발생했습니다: {error}
            </div>
          ) : stats ? (
            <>
              {/* 통계 요약 카드 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 전체 조회수 */}
                <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4">
                  <div className="text-sm text-[var(--color-text-secondary)] mb-1">
                    전체
                  </div>
                  <div className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {stats.total.toLocaleString()}
                  </div>
                </div>

                {/* 오늘 조회수 */}
                <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4">
                  <div className="text-sm text-[var(--color-text-secondary)] mb-1">
                    오늘
                  </div>
                  <div className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {stats.today.toLocaleString()}
                  </div>
                </div>

                {/* 어제 조회수 */}
                <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4">
                  <div className="text-sm text-[var(--color-text-secondary)] mb-1">
                    어제
                  </div>
                  <div className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {stats.yesterday.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* 최근 7일 차트 */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                  최근 7일 조회수 추이
                </h3>
                <LineChart
                  data={stats.weeklyStats.map((d) => ({
                    date: d.date,
                    value: d.views,
                  }))}
                  width={800}
                  height={250}
                  color="var(--color-primary)"
                />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}

