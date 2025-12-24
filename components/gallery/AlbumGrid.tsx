'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { AlbumListItem } from '@/types/album';

interface AlbumGridProps {
  albums: AlbumListItem[];
}

export function AlbumGrid({ albums }: AlbumGridProps) {
  if (albums.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--color-text-secondary)]">
        아직 공개된 앨범이 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {albums.map((album) => (
        <Link
          key={album.id}
          href={`/gallery/${album.id}`}
          className="group"
        >
          <article className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
            {/* 앨범 커버 이미지 */}
            <div className="relative aspect-square bg-[var(--color-bg-secondary)] overflow-hidden">
              {album.coverImageUrl ? (
                <Image
                  src={album.coverImageUrl}
                  alt={album.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📷</div>
                    <div className="text-sm opacity-80">커버 이미지 없음</div>
                  </div>
                </div>
              )}
              {/* 이미지 개수 뱃지 */}
              {album.imageCount > 0 && (
                <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                  {album.imageCount}장
                </div>
              )}
            </div>

            {/* 앨범 정보 */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1 line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">
                {album.title}
              </h3>
              {album.description && (
                <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-2">
                  {album.description}
                </p>
              )}
              <p className="text-xs text-[var(--color-text-tertiary)]">
                {new Date(album.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}


