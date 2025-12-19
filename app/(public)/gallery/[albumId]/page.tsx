import { getAlbumById } from '@/lib/supabase/albums';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{ albumId: string }>;
}) {
  const { albumId } = await params;
  const album = await getAlbumById(albumId);

  if (!album || !album.isPublished) {
    redirect('/gallery');
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/gallery"
          className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-4 inline-block"
        >
          ← 갤러리로 돌아가기
        </Link>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          {album.title}
        </h1>
        {album.description && (
          <p className="text-[var(--color-text-secondary)]">{album.description}</p>
        )}
      </div>

      {album.images.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-text-secondary)]">
          이 앨범에는 사진이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {album.images.map((image) => (
            <div
              key={image.id}
              className="relative aspect-square bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden group"
            >
              <Image
                src={image.imageUrl}
                alt={image.title || '앨범 이미지'}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {image.title && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-end">
                  <p className="p-2 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    {image.title}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

