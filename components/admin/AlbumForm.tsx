'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Album } from '@/types/album';
import { AlbumImageUploader } from './AlbumImageUploader';
import { AlbumImageList } from './AlbumImageList';

interface AlbumFormProps {
  initialData?: Partial<Album>;
  albumId?: string;
}

export function AlbumForm({ initialData, albumId }: AlbumFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    coverImageUrl: initialData?.coverImageUrl || '',
    isPublished: initialData?.isPublished ?? false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = albumId ? `/api/albums/${albumId}` : '/api/albums';
      const method = albumId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '앨범 저장에 실패했습니다.');
      }

      toast.success(albumId ? '앨범이 수정되었습니다.' : '앨범이 생성되었습니다.');
      router.push('/dashboard/albums');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '앨범 저장에 실패했습니다.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-[var(--color-error-bg)] text-[var(--color-error)] border border-[var(--color-error)] rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
        >
          앨범 제목 *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          placeholder="예: HISOSIMA"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
        >
          앨범 설명
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-y"
          placeholder="앨범에 대한 설명을 입력하세요"
        />
      </div>

      <div>
        <label
          htmlFor="coverImageUrl"
          className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
        >
          대표 이미지 URL
        </label>
        <input
          type="text"
          id="coverImageUrl"
          name="coverImageUrl"
          value={formData.coverImageUrl}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          placeholder="대표 이미지 URL을 입력하세요"
        />
      </div>

      <div className="flex items-center gap-4">
        <label
          htmlFor="isPublished"
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            type="checkbox"
            id="isPublished"
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleChange}
            className="w-4 h-4 text-[var(--color-primary)] border-[var(--color-border)] rounded focus:ring-[var(--color-primary)]"
          />
          <span className="text-sm text-[var(--color-text-primary)]">공개</span>
        </label>
      </div>

      {albumId && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
            사진 관리
          </h2>
          <AlbumImageUploader albumId={albumId} />
          <AlbumImageList albumId={albumId} />
        </div>
      )}

      <div className="flex items-center justify-end gap-4 pt-4 border-t border-[var(--color-border)]">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={loading || !formData.title.trim()}
          className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '저장 중...' : albumId ? '수정하기' : '생성하기'}
        </button>
      </div>
    </form>
  );
}

