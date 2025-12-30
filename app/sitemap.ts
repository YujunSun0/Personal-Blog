import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

type PostRow = Database['public']['Tables']['posts']['Row'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yujunsun-blog.vercel.app';
  
  try {
    // cookies를 사용하지 않는 공개 클라이언트 생성 (정적 생성용)
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 공개된 모든 글 조회
    const { data, error } = await supabase
      .from('posts')
      .select('id, created_at')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const posts = (data || []) as unknown as Array<Pick<PostRow, 'id' | 'created_at'>>;

    // 글 상세 페이지 URL 생성 (slug는 post.id를 사용)
    const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${siteUrl}/posts/${post.id}`,
      lastModified: new Date(post.created_at),
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

