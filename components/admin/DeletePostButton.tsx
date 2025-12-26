'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface DeletePostButtonProps {
  postId: string;
  postTitle?: string;
}

export function DeletePostButton({ postId, postTitle }: DeletePostButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '글 삭제에 실패했습니다.');
      }

      // 현재 페이지가 글 관리 페이지가 아니면 이동
      if (!pathname?.includes('/dashboard/posts')) {
        router.push('/dashboard/posts');
      } else {
        // 같은 페이지에 있으면 새로고침만
        router.refresh();
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : '글 삭제에 실패했습니다.');
      setLoading(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="text-xs text-[var(--color-text-secondary)] sm:hidden mb-1">
          정말 삭제하시겠습니까?
        </div>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-4 py-2 text-sm bg-[var(--color-error)] text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '삭제 중...' : '확인'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={loading}
          className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          취소
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setShowConfirm(true);
      }}
      className="px-4 py-2 text-sm border border-[var(--color-error)] text-[var(--color-error)] rounded-lg hover:bg-[var(--color-error-bg)] transition-colors"
      title={postTitle ? `"${postTitle}" 삭제` : '글 삭제'}
    >
      삭제
    </button>
  );
}
