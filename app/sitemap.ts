import { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/lib/supabase/posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yujunsun-blog.vercel.app';
  
  try {
    // 공개된 모든 글 조회
    const posts = await getPublishedPosts();

    // 글 상세 페이지 URL 생성 (slug는 post.id를 사용)
    const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${siteUrl}/posts/${post.id}`,
      lastModified: new Date(post.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // 기본 페이지들
    const staticUrls: MetadataRoute.Sitemap = [
      {
        url: siteUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      {
        url: `${siteUrl}/gallery`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
    ];

    return [...staticUrls, ...postUrls];
  } catch (error) {
    console.error('Sitemap generation error:', error);
    // 에러 발생 시 기본 페이지만 반환
    return [
      {
        url: siteUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
    ];
  }
}

