'use client';

import { useState } from 'react';

type ViewMode = 'photos' | 'albums';

interface GalleryTabsProps {
  defaultView?: ViewMode;
  onViewChange?: (view: ViewMode) => void;
}

export function GalleryTabs({ defaultView = 'photos', onViewChange }: GalleryTabsProps) {
  const [currentView, setCurrentView] = useState<ViewMode>(defaultView);

  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view);
    onViewChange?.(view);
  };

  return (
    <div className="border-b border-[var(--color-border)] mb-8">
      <nav className="flex gap-8" role="tablist" aria-label="갤러리 보기 방식">
        <button
          onClick={() => handleViewChange('photos')}
          role="tab"
          aria-selected={currentView === 'photos'}
          aria-controls="gallery-content"
          className={`pb-4 px-1 text-base font-medium transition-colors whitespace-nowrap border-b-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 rounded-t ${
            currentView === 'photos'
              ? 'text-[var(--color-text-primary)] border-[var(--color-text-primary)]'
              : 'text-[var(--color-text-secondary)] border-transparent hover:text-[var(--color-text-primary)]'
          }`}
        >
          사진
        </button>
        <button
          onClick={() => handleViewChange('albums')}
          role="tab"
          aria-selected={currentView === 'albums'}
          aria-controls="gallery-content"
          className={`pb-4 px-1 text-base font-medium transition-colors whitespace-nowrap border-b-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 rounded-t ${
            currentView === 'albums'
              ? 'text-[var(--color-text-primary)] border-[var(--color-text-primary)]'
              : 'text-[var(--color-text-secondary)] border-transparent hover:text-[var(--color-text-primary)]'
          }`}
        >
          앨범
        </button>
      </nav>
    </div>
  );
}


