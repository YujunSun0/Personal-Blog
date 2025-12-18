'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeletePostButtonProps {
  postId: string;
}

export function DeletePostButton({ postId }: DeletePostButtonProps) {
  const router = useRouter();
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

      router.push('/dashboard/posts');
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : '글 삭제에 실패했습니다.');
      setLoading(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-4 py-2 bg-[var(--color-error)] text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '삭제 중...' : '확인'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={loading}
          className="px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors"
        >
          취소
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="px-4 py-2 border border-[var(--color-error)] text-[var(--color-error)] rounded-lg hover:bg-[var(--color-error-bg)] transition-colors"
    >
      삭제
    </button>
  );
}


