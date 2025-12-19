import { redirect } from 'next/navigation';
import { getAlbumById } from '@/lib/supabase/albums';
import { AlbumForm } from '@/components/admin/AlbumForm';

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
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
        앨범 관리: {album.title}
      </h1>
      <AlbumForm initialData={album} albumId={album.id} />
    </div>
  );
}

