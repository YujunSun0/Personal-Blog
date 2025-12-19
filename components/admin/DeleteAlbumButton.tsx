'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface DeleteAlbumButtonProps {
  albumId: string;
  albumTitle: string;
}

export function DeleteAlbumButton({ albumId, albumTitle }: DeleteAlbumButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/albums/${albumId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '앨범 삭제에 실패했습니다.');
      }

      toast.success('앨범이 삭제되었습니다.');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '앨범 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--color-text-secondary)]">정말 삭제하시겠습니까?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-2 py-1 text-xs bg-[var(--color-error)] text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          삭제
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={loading}
          className="px-2 py-1 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          취소
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="px-3 py-1 text-sm text-[var(--color-error)] hover:text-red-700 transition-colors"
    >
      삭제
    </button>
  );
}

