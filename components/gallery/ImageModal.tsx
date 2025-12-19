'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import type { AlbumImage } from '@/types/album';
import Link from 'next/link';

interface GalleryImage extends AlbumImage {
  albumTitle: string;
}

interface ImageModalProps {
  image: GalleryImage;
  allImages: GalleryImage[];
  onClose: () => void;
  onNavigate: (image: GalleryImage) => void;
}

export function ImageModal({ image, allImages, onNavigate, onClose }: ImageModalProps) {
  const currentIndex = allImages.findIndex((img) => img.id === image.id);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onNavigate(allImages[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < allImages.length - 1) {
      onNavigate(allImages[currentIndex + 1]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-7xl max-h-full w-full h-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
        >
          ✕
        </button>

        {/* 이전/다음 버튼 */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
          >
            ‹
          </button>
        )}
        {currentIndex < allImages.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
          >
            ›
          </button>
        )}

        {/* 이미지 */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <Image
            src={image.imageUrl}
            alt={image.title || '갤러리 이미지'}
            width={1200}
            height={1200}
            className="max-w-full max-h-full object-contain"
            priority
          />
        </div>

        {/* 이미지 정보 */}
        <div className="bg-black bg-opacity-50 text-white p-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-2">
              <Link
                href={`/gallery/${image.albumId}`}
                className="text-sm text-blue-300 hover:text-blue-200 hover:underline"
              >
                📁 {image.albumTitle}
              </Link>
            </div>
            {image.title && (
              <h3 className="text-lg font-semibold mb-2">{image.title}</h3>
            )}
            {image.description && (
              <p className="text-sm text-gray-300 mb-2">{image.description}</p>
            )}
            <div className="text-xs text-gray-400">
              {currentIndex + 1} / {allImages.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

