'use client';

import { useState } from 'react';
import { PostStats } from './PostStats';

interface PostStatsModalProps {
  postId: string;
}

export function PostStatsModal({ postId }: PostStatsModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1 text-xs bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-lg transition-colors"
      >
        통계 보기
      </button>
      <PostStats postId={postId} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

