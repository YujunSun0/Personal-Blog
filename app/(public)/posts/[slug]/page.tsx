import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getPostBySlug } from '@/lib/supabase/posts';
import { getTagsByPostId } from '@/lib/supabase/tags';
import { PostHeader } from '@/components/post/PostHeader';
import { PostContent } from '@/components/post/PostContent';
import { PostTags } from '@/components/post/PostTags';
import { CommentList } from '@/components/comment/CommentList';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

// 동적 메타 정보 생성
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.isPublished) {
    return {
      title: '글을 찾을 수 없습니다',
    };
  }

  const tags = await getTagsByPostId(post.id);
  const tagNames = tags.map((tag) => tag.name).join(', ');
  
  // 설명 생성 (description이 있으면 사용, 없으면 content의 처음 160자)
  const description = post.description || 
    post.content
      .replace(/[#*`\[\]()]/g, '') // 마크다운 문법 제거
      .replace(/\n/g, ' ')
      .trim()
      .substring(0, 160) + '...';

  // 썸네일 URL 또는 기본 이미지
  const imageUrl = post.thumbnailUrl || '/images/blog_banner.png';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yujunsun-blog.vercel.app';
  const postUrl = `${siteUrl}/posts/${post.id}`;

  return {
    title: post.title,
    description,
    keywords: tagNames ? tagNames.split(', ') : [],
    authors: [{ name: 'yujunsun0' }],
    openGraph: {
      type: 'article',
      locale: 'ko_KR',
      url: postUrl,
      siteName: 'Yujunsun\'s Blog',
      title: post.title,
      description,
      images: [
        {
          url: imageUrl.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: ['yujunsun0'],
      tags: tagNames ? tagNames.split(', ') : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [imageUrl.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl}`],
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // 공개된 글만 표시
  if (!post.isPublished) {
    notFound();
  }

  // 태그 조회
  const tags = await getTagsByPostId(post.id);

  // 구조화된 데이터 (Schema.org Article)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yujunsun-blog.vercel.app';
  const postUrl = `${siteUrl}/posts/${post.id}`;
  const imageUrl = post.thumbnailUrl || `${siteUrl}/images/blog_banner.png`;
  const description = post.description || 
    post.content
      .replace(/[#*`\[\]()]/g, '')
      .replace(/\n/g, ' ')
      .trim()
      .substring(0, 160);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: description,
    image: imageUrl.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl}`,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: 'yujunsun',
    },
    publisher: {
      '@type': 'Organization',
      name: '기술 블로그',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/blog_banner.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    keywords: tags.map((tag) => tag.name).join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <article className="container-width-narrow mx-auto container-padding-x py-8">
        <PostHeader post={post} />
        {tags.length > 0 && <PostTags tags={tags} />}
        <PostContent content={post.content} thumbnailUrl={post.thumbnailUrl} title={post.title} />
        <CommentList postId={post.id} />
      </article>
    </>
  );
}


