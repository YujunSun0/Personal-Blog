import { getAlbumById } from '@/lib/supabase/albums';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AlbumDetailView } from '@/components/gallery/AlbumDetailView';

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
    <div className="max-w-[var(--container-max-width)] mx-auto px-[var(--container-padding-x)] py-8">
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

      <AlbumDetailView album={album} />
    </div>
  );
}

