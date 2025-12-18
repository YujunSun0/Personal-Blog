import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/supabase/posts';
import { getTagsByPostId } from '@/lib/supabase/tags';
import { PostHeader } from '@/components/post/PostHeader';
import { PostContent } from '@/components/post/PostContent';
import { PostTags } from '@/components/post/PostTags';

interface PostPageProps {
  params: Promise<{ slug: string }>;
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

  return (
    <article className="max-w-[var(--container-max-width)] mx-auto px-[var(--container-padding-x)] py-8">
      <PostHeader post={post} />
      {tags.length > 0 && <PostTags tags={tags} />}
      <PostContent content={post.content} />
    </article>
  );
}


