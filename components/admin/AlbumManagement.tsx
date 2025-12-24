'use client';

import { useState } from 'react';
import type { AlbumWithImages } from '@/types/album';
import { AlbumForm } from './AlbumForm';
import { AlbumImageManager } from './AlbumImageManager';

type TabType = 'info' | 'images';

interface AlbumManagementProps {
  album: AlbumWithImages;
}

export function AlbumManagement({ album }: AlbumManagementProps) {
  const [activeTab, setActiveTab] = useState<TabType>('info');

  return (
    <div>
      {/* 탭 네비게이션 */}
      <div className="border-b border-[var(--color-border)] mb-6">
        <nav className="flex gap-8" role="tablist" aria-label="앨범 관리 탭">
          <button
            onClick={() => setActiveTab('info')}
            role="tab"
            aria-selected={activeTab === 'info'}
            aria-controls="album-info-panel"
            className={`pb-4 px-1 text-base font-medium transition-colors whitespace-nowrap border-b-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 rounded-t ${
              activeTab === 'info'
                ? 'text-[var(--color-text-primary)] border-[var(--color-text-primary)]'
                : 'text-[var(--color-text-secondary)] border-transparent hover:text-[var(--color-text-primary)]'
            }`}
          >
            앨범 정보
          </button>
          <button
            onClick={() => setActiveTab('images')}
            role="tab"
            aria-selected={activeTab === 'images'}
            aria-controls="album-images-panel"
            className={`pb-4 px-1 text-base font-medium transition-colors whitespace-nowrap border-b-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 rounded-t ${
              activeTab === 'images'
                ? 'text-[var(--color-text-primary)] border-[var(--color-text-primary)]'
                : 'text-[var(--color-text-secondary)] border-transparent hover:text-[var(--color-text-primary)]'
            }`}
          >
            사진 관리 ({album.images.length}장)
          </button>
        </nav>
      </div>

      {/* 탭 컨텐츠 */}
      <div role="tabpanel" id={activeTab === 'info' ? 'album-info-panel' : 'album-images-panel'}>
        {activeTab === 'info' ? (
          <AlbumForm initialData={album} albumId={album.id} />
        ) : (
          <AlbumImageManager albumId={album.id} initialImages={album.images} />
        )}
      </div>
    </div>
  );
}

