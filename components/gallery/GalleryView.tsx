'use client';

import { useState } from 'react';
import { GalleryTabs } from './GalleryTabs';
import { GalleryMasonry } from './GalleryMasonry';
import { AlbumGrid } from './AlbumGrid';
import type { AlbumImage } from '@/types/album';
import type { AlbumListItem } from '@/types/album';

interface GalleryImage extends AlbumImage {
  albumTitle: string;
}

interface GalleryViewProps {
  images: GalleryImage[];
  albums: AlbumListItem[];
}

export function GalleryView({ images, albums }: GalleryViewProps) {
  const [viewMode, setViewMode] = useState<'photos' | 'albums'>('photos');

  return (
    <div>
      <GalleryTabs
        defaultView={viewMode}
        onViewChange={(view) => setViewMode(view)}
      />
      
      <div id="gallery-content" role="tabpanel">
        {viewMode === 'photos' ? (
          <GalleryMasonry images={images} />
        ) : (
          <AlbumGrid albums={albums} />
        )}
      </div>
    </div>
  );
}


