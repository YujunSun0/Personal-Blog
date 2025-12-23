import type { Metadata } from 'next';
import { getPublishedAlbumImages } from '@/lib/supabase/albumImages';
import { GalleryMasonry } from '@/components/gallery/GalleryMasonry';

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

