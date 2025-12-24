'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { AlbumImage } from '@/types/album';
import { ImageModal } from './ImageModal';

interface GalleryImage extends AlbumImage {
  albumTitle: string;
}

interface GalleryMasonryProps {
  images: GalleryImage[];
}

export function GalleryMasonry({ images }: GalleryMasonryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--color-text-secondary)]">
        아직 업로드된 사진이 없습니다.
      </div>
    );
  }

  return (
    <>
      {/* Pinterest 스타일 Masonry Layout */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
        {images.map((image) => {
          // 이미지 비율에 따라 높이를 다르게 설정 (Pinterest 스타일)
          const aspectRatio = Math.random() * 0.5 + 0.75; // 0.75 ~ 1.25 사이의 랜덤 비율
          
          return (
            <div
              key={image.id}
              className="mb-4 break-inside-avoid cursor-pointer group"
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative overflow-hidden rounded-lg bg-[var(--color-bg-secondary)] shadow-sm hover:shadow-lg transition-shadow">
                <div className="relative" style={{ aspectRatio: aspectRatio }}>
                  <Image
                    src={image.imageUrl}
                    alt={image.title || '갤러리 이미지'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  />
                </div>
                {/* 호버 시 앨범 정보 표시 */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
                  <div className="w-full p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    {image.albumTitle && (
                      <p className="text-white text-sm font-medium truncate">
                        {image.albumTitle}
                      </p>
                    )}
                    {image.title && (
                      <p className="text-white/90 text-xs truncate mt-1">
                        {image.title}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          allImages={images}
          onClose={() => setSelectedImage(null)}
          onNavigate={(image) => setSelectedImage(image)}
        />
      )}
    </>
  );
}

