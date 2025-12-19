import Link from 'next/link';
import { getAllAlbums } from '@/lib/supabase/albums';
import { DeleteAlbumButton } from '@/components/admin/DeleteAlbumButton';

export default async function AlbumsPage() {
  const albums = await getAllAlbums();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">앨범 관리</h1>
        <Link
          href="/dashboard/albums/new"
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          새 앨범 만들기
        </Link>
      </div>

      {albums.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[var(--color-text-secondary)]">앨범이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <div
              key={album.id}
              className="bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border)] overflow-hidden hover:shadow-lg transition-shadow"
            >
              {album.coverImageUrl ? (
                <div className="aspect-video bg-[var(--color-bg-secondary)] overflow-hidden">
                  <img
                    src={album.coverImageUrl}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-[var(--color-bg-secondary)] flex items-center justify-center">
                  <span className="text-[var(--color-text-tertiary)]">이미지 없음</span>
                </div>
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                  {album.title}
                </h2>
                {album.description && (
                  <p className="text-sm text-[var(--color-text-secondary)] mb-3 line-clamp-2">
                    {album.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-[var(--color-text-tertiary)]">
                    <span>{album.imageCount}장</span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        album.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {album.isPublished ? '공개' : '비공개'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/albums/${album.id}`}
                      className="px-3 py-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                    >
                      관리
                    </Link>
                    <DeleteAlbumButton albumId={album.id} albumTitle={album.title} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

