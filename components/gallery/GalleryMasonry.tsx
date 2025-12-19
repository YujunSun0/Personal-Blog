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
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="mb-4 break-inside-avoid cursor-pointer group"
            onClick={() => setSelectedImage(image)}
          >
            <div className="relative overflow-hidden rounded-lg bg-[var(--color-bg-secondary)] aspect-auto">
              <Image
                src={image.imageUrl}
                alt={image.title || '갤러리 이미지'}
                width={400}
                height={400}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
          </div>
        ))}
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

