'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import type { AlbumImage } from '@/types/album';
import { AlbumImageUploader } from './AlbumImageUploader';

interface AlbumImageManagerProps {
  albumId: string;
  initialImages: AlbumImage[];
}

export function AlbumImageManager({ albumId, initialImages }: AlbumImageManagerProps) {
  const [images, setImages] = useState<AlbumImage[]>(initialImages);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // 이미지 목록 새로고침
  const refreshImages = async () => {
    try {
      const response = await fetch(`/api/albums/${albumId}/images`);
      if (!response.ok) {
        throw new Error('이미지 목록 조회 실패');
      }
      const data = await response.json();
      setImages(data);
      setSelectedImages(new Set()); // 선택 초기화
    } catch (error) {
      toast.error('이미지 목록을 불러오는데 실패했습니다.');
    }
  };

  // 이미지 업로드 완료 후 새로고침
  const handleUploadComplete = () => {
    refreshImages();
  };

  // 개별 이미지 선택/해제
  const toggleImageSelection = (imageId: string) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  };

  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(images.map((img) => img.id)));
    }
  };

  // 개별 삭제
  const handleDelete = async (imageId: string) => {
    if (!confirm('이미지를 삭제하시겠습니까?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/albums/images/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '이미지 삭제 실패');
      }

      toast.success('이미지가 삭제되었습니다.');
      refreshImages();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '이미지 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 선택된 이미지 일괄 삭제
  const handleBulkDelete = async () => {
    if (selectedImages.size === 0) {
      toast.error('삭제할 이미지를 선택해주세요.');
      return;
    }

    if (!confirm(`선택한 ${selectedImages.size}개의 이미지를 삭제하시겠습니까?`)) return;

    setLoading(true);
    try {
      const deletePromises = Array.from(selectedImages).map((imageId) =>
        fetch(`/api/albums/images/${imageId}`, {
          method: 'DELETE',
        })
      );

      const results = await Promise.allSettled(deletePromises);
      const failed = results.filter((r) => r.status === 'rejected').length;

      if (failed === 0) {
        toast.success(`${selectedImages.size}개의 이미지가 삭제되었습니다.`);
      } else {
        toast.warning(`${selectedImages.size - failed}개의 이미지가 삭제되었습니다. (${failed}개 실패)`);
      }

      refreshImages();
    } catch (error) {
      toast.error('이미지 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && images.length === 0) {
    return <div className="text-[var(--color-text-secondary)]">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 업로드 섹션 */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
          사진 업로드
        </h2>
        <AlbumImageUploader albumId={albumId} onUploadComplete={handleUploadComplete} />
      </div>

      {/* 이미지 목록 섹션 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            사진 목록 ({images.length}장)
          </h2>
          {images.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSelectAll}
                className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
              >
                {selectedImages.size === images.length ? '전체 해제' : '전체 선택'}
              </button>
              {selectedImages.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  선택 삭제 ({selectedImages.size})
                </button>
              )}
            </div>
          )}
        </div>

        {images.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-lg">
            업로드된 사진이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {images.map((image) => {
              const isSelected = selectedImages.has(image.id);
              return (
                <div
                  key={image.id}
                  className={`relative group bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-offset-2'
                      : 'border-[var(--color-border)]'
                  }`}
                  onClick={() => toggleImageSelection(image.id)}
                >
                  {/* 체크박스 */}
                  <div className="absolute top-2 left-2 z-10">
                    <div
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[var(--color-primary)] border-[var(--color-primary)]'
                          : 'bg-white/80 border-gray-300'
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* 이미지 - 원본 비율 유지, 컨테이너는 일정한 크기 */}
                  <div className="relative w-full aspect-square bg-[var(--color-bg-secondary)]">
                    <Image
                      src={image.imageUrl}
                      alt={image.title || '앨범 이미지'}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                      onError={(e) => {
                        console.error('Image load error:', image.imageUrl);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>

                  {/* 호버 시 삭제 버튼 */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(image.id);
                      }}
                      disabled={loading}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm pointer-events-auto"
                    >
                      삭제
                    </button>
                  </div>

                  {/* 이미지 정보 (하단) */}
                  {image.title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <p className="text-white text-xs truncate">{image.title}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

