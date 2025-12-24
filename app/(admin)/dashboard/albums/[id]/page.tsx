import { redirect } from 'next/navigation';
import { getAlbumById } from '@/lib/supabase/albums';
import { AlbumManagement } from '@/components/admin/AlbumManagement';

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const album = await getAlbumById(id);

  if (!album) {
    redirect('/dashboard/albums');
  }

  return (
    <div className="max-w-[var(--container-max-width)] mx-auto px-[var(--container-padding-x)] py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
          앨범 관리: {album.title}
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          앨범 정보를 수정하거나 사진을 관리할 수 있습니다.
        </p>
      </div>
      <AlbumManagement album={album} />
    </div>
  );
}

