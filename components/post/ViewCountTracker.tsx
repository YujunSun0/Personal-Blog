'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface ViewCountTrackerProps {
  postId: string;
}

/**
 * 조회수 증가 컴포넌트
 * 글 상세 페이지에서 자동으로 조회수 증가
 */
export function ViewCountTracker({ postId }: ViewCountTrackerProps) {
  const pathname = usePathname();

  useEffect(() => {
    // 공개된 글 상세 페이지에서만 조회수 증가
    if (!pathname?.includes('/posts/')) {
      return;
    }

    // 조회수 증가 API 호출
    const incrementView = async () => {
      try {
        await fetch(`/api/posts/${postId}/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        // 조회수 증가 실패는 조용히 처리 (사용자 경험에 영향 없음)
        console.error('Failed to increment view count:', error);
      }
    };

    // 약간의 지연 후 실행 (페이지 로드 완료 후)
    const timer = setTimeout(() => {
      incrementView();
    }, 1000);

    return () => clearTimeout(timer);
  }, [postId, pathname]);

  return null; // UI 렌더링 없음
}

