import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getPostById } from '@/lib/supabase/posts';
import { PostForm } from '@/components/admin/PostForm';
import { DeletePostButton } from '@/components/admin/DeletePostButton';

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
        tags: [], // TODO: 태그 데이터 연동
      }}
    />
  );
}

