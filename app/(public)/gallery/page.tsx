import type { Metadata } from 'next';
import { getPublishedAlbumImages } from '@/lib/supabase/albumImages';
import { getPublishedAlbums } from '@/lib/supabase/albums';
import { GalleryView } from '@/components/gallery/GalleryView';

export const metadata: Metadata = {
  title: '여행 사진 갤러리',
  description: '여행 사진을 모아둔 갤러리입니다.',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yujunsun-blog.vercel.app'}/gallery`,
    siteName: 'Yujunsun\'s Blog',
    title: '여행 사진 갤러리',
    description: '여행 사진을 모아둔 갤러리입니다.',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yujunsun-blog.vercel.app'}/images/blog_banner.png`,
        width: 1200,
        height: 630,
        alt: '갤러리',
      },
    ],
  },
};

export default async function GalleryPage() {
  const [images, albums] = await Promise.all([
    getPublishedAlbumImages(),
    getPublishedAlbums(),
  ]);

  return (
    <div className="max-w-[var(--container-max-width)] mx-auto px-[var(--container-padding-x)] py-8">
      <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-8">
        갤러리
      </h1>
      <GalleryView images={images} albums={albums} />
    </div>
  );
}

