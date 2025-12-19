'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import type { AlbumImage } from '@/types/album';

interface AlbumImageListProps {
  albumId: string;
}

export function AlbumImageList({ albumId }: AlbumImageListProps) {
  const [images, setImages] = useState<AlbumImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, [albumId]);

  const fetchImages = async () => {
    try {
      const response = await fetch(`/api/albums/${albumId}/images`);
      if (!response.ok) {
        throw new Error('이미지 목록 조회 실패');
      }
      const data = await response.json();
      setImages(data);
    } catch (error) {
      toast.error('이미지 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm('이미지를 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/albums/images/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '이미지 삭제 실패');
      }

      toast.success('이미지가 삭제되었습니다.');
      fetchImages();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '이미지 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className="text-[var(--color-text-secondary)]">로딩 중...</div>;
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--color-text-secondary)]">
        업로드된 사진이 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="relative group bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden aspect-square"
        >
          <Image
            src={image.imageUrl}
            alt={image.title || '앨범 이미지'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
            <button
              onClick={() => handleDelete(image.id)}
              className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-opacity"
            >
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

