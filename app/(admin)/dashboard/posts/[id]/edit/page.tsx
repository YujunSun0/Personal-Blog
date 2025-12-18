import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getPostById } from '@/lib/supabase/posts';
import { getTagsByPostId } from '@/lib/supabase/tags';
import { PostForm } from '@/components/admin/PostForm';

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    redirect('/dashboard/posts');
  }

  // 태그 조회
  const tags = await getTagsByPostId(id);
  const tagNames = tags.map((tag) => tag.name);

  return (
    <PostForm
      postId={id}
      initialData={{
        title: post.title,
        description: post.description || '',
        content: post.content,
        type: post.type,
        thumbnailUrl: post.thumbnailUrl || '',
        isPublished: post.isPublished,
        tags: tagNames,
      }}
    />
  );
}

