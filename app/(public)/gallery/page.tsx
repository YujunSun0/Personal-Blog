import { getPublishedAlbumImages } from '@/lib/supabase/albumImages';
import { GalleryMasonry } from '@/components/gallery/GalleryMasonry';

export default async function GalleryPage() {
  const images = await getPublishedAlbumImages();

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-8">
        갤러리
      </h1>
      <GalleryMasonry images={images} />
    </div>
  );
}

