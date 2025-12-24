'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { AlbumWithImages } from '@/types/album';
import { ImageModal } from './ImageModal';

interface AlbumDetailViewProps {
  album: AlbumWithImages;
}

interface GalleryImage {
  id: string;
  albumId: string;
  imageUrl: string;
  title: string | null;
  description: string | null;
  position: number;
  createdAt: string;
  albumTitle: string;
}

export function AlbumDetailView({ album }: AlbumDetailViewProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // 앨범 이미지를 GalleryImage 형식으로 변환
  const galleryImages: GalleryImage[] = album.images.map((img) => ({
    ...img,
    albumTitle: album.title,
  }));

  if (album.images.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--color-text-secondary)]">
        이 앨범에는 사진이 없습니다.
      </div>
    );
  }

  return (
    <>
      {/* 일반 Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {album.images.map((image) => (
          <div
            key={image.id}
            className="relative aspect-square bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden group cursor-pointer"
            onClick={() => setSelectedImage({ ...image, albumTitle: album.title })}
          >
            <Image
              src={image.imageUrl}
              alt={image.title || album.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              onError={(e) => {
                console.error('Image load error:', image.imageUrl);
                // 이미지 로드 실패 시 대체 처리
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            {/* 호버 시 이미지 정보 표시 */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
              <div className="w-full p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                {image.title && (
                  <p className="text-white text-sm font-medium truncate">
                    {image.title}
                  </p>
                )}
                {image.description && (
                  <p className="text-white/90 text-xs truncate mt-1">
                    {image.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          allImages={galleryImages}
          onClose={() => setSelectedImage(null)}
          onNavigate={(image) => setSelectedImage(image)}
        />
      )}
    </>
  );
}

