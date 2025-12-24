'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';

interface AlbumImageUploaderProps {
  albumId: string;
  onUploadComplete?: () => void;
}

export function AlbumImageUploader({ albumId, onUploadComplete }: AlbumImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      // 여러 파일을 순차적으로 업로드
      for (const file of Array.from(files)) {
        // 파일 업로드
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', `albums/${albumId}`);

        const uploadResponse = await fetch('/api/upload/image', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || '이미지 업로드 실패');
        }

        const { url } = await uploadResponse.json();

        // 앨범에 이미지 추가
        const addResponse = await fetch(`/api/albums/${albumId}/images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl: url,
            title: file.name.replace(/\.[^/.]+$/, ''), // 확장자 제거
          }),
        });

        if (!addResponse.ok) {
          const errorData = await addResponse.json();
          throw new Error(errorData.error || '앨범에 이미지 추가 실패');
        }
      }

      toast.success(`${files.length}개의 이미지가 업로드되었습니다.`);
      // 업로드 완료 콜백 호출
      onUploadComplete?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="mb-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        disabled={uploading}
        className="hidden"
        id="album-image-upload"
      />
      <label
        htmlFor="album-image-upload"
        className={`inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] rounded-lg cursor-pointer transition-colors ${
          uploading
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-[var(--color-bg-secondary)]'
        }`}
      >
        {uploading ? (
          <>
            <span className="animate-spin">⏳</span>
            <span className="text-sm text-[var(--color-text-secondary)]">업로드 중...</span>
          </>
        ) : (
          <>
            <span>📷</span>
            <span className="text-sm text-[var(--color-text-primary)]">사진 추가</span>
          </>
        )}
      </label>
    </div>
  );
}

