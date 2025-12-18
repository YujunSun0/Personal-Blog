import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getAllPosts } from '@/lib/supabase/posts';
import { PostCard } from '@/components/post/PostCard';

export default async function PostsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const posts = await getAllPosts();

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
          글 관리
        </h1>
        <Link
          href="/dashboard/posts/new"
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          새 글 작성
        </Link>
      </div>

      {/* 글 목록 */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border)]">
            <p className="text-[var(--color-text-secondary)] mb-4">
              아직 작성된 글이 없습니다.
            </p>
            <Link
              href="/dashboard/posts/new"
              className="text-[var(--color-primary)] hover:underline"
            >
              첫 글을 작성해보세요
            </Link>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              href={`/dashboard/posts/${post.id}/edit`}
            />
          ))
        )}
      </div>
    </>
  );
}

