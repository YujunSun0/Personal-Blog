'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import type { Album } from '@/types/album';

interface AlbumFormProps {
  initialData?: Partial<Album>;
  albumId?: string;
}

export function AlbumForm({ initialData, albumId }: AlbumFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
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

  const handleCoverImageUpload = async (file: File) => {
    setUploadingCover(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'albums/covers');

      const uploadResponse = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || '대표 이미지 업로드 실패');
      }

      const { url } = await uploadResponse.json();
      setFormData((prev) => ({ ...prev, coverImageUrl: url }));
      toast.success('대표 이미지가 업로드되었습니다.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '대표 이미지 업로드에 실패했습니다.');
    } finally {
      setUploadingCover(false);
      if (coverFileInputRef.current) {
        coverFileInputRef.current.value = '';
      }
    }
  };

  const handleCoverFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    await handleCoverImageUpload(file);
  };

  const handleRemoveCoverImage = () => {
    setFormData((prev) => ({ ...prev, coverImageUrl: '' }));
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
      
      // 로딩 상태 해제
      setLoading(false);
      
      // 약간의 딜레이 후 페이지 새로고침 (토스트 메시지가 보이도록)
      setTimeout(() => {
        if (albumId) {
          // 앨범 수정인 경우 현재 페이지 새로고침
          router.refresh();
        } else {
          // 앨범 생성인 경우 목록 페이지로 이동
          router.push('/dashboard/albums');
        }
      }, 500);
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
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
          대표 이미지
        </label>
        
        {/* 파일 업로드 입력 */}
        <input
          ref={coverFileInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverFileSelect}
          disabled={uploadingCover}
          className="hidden"
          id="cover-image-upload"
        />
        
        <div className="flex flex-col gap-4">
          {/* 업로드 버튼 */}
          <div>
            <label
              htmlFor="cover-image-upload"
              className={`inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] rounded-lg cursor-pointer transition-colors ${
                uploadingCover
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-[var(--color-bg-secondary)]'
              }`}
            >
              {uploadingCover ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span className="text-sm text-[var(--color-text-secondary)]">업로드 중...</span>
                </>
              ) : (
                <>
                  <span>📷</span>
                  <span className="text-sm text-[var(--color-text-primary)]">
                    {formData.coverImageUrl ? '대표 이미지 변경' : '대표 이미지 업로드'}
                  </span>
                </>
              )}
            </label>
          </div>

          {/* 이미지 미리보기 */}
          {formData.coverImageUrl && (
            <div className="relative inline-block">
              <div className="relative w-64 h-48 border border-[var(--color-border)] rounded-lg overflow-hidden bg-[var(--color-bg-secondary)]">
                <Image
                  src={formData.coverImageUrl}
                  alt="대표 이미지"
                  fill
                  className="object-contain"
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveCoverImage}
                className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors text-sm"
                title="대표 이미지 제거"
              >
                ×
              </button>
            </div>
          )}
        </div>
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

