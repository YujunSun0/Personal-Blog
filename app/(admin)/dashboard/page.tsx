import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getAllPosts } from '@/lib/supabase/posts';
import { PostCard } from '@/components/post/PostCard';

export default async function DashboardPage() {
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
          대시보드
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          환영합니다, {user.email}님!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/dashboard/posts"
          className="bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border)] p-6 hover:border-[var(--color-border-hover)] transition-colors"
        >
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
            글 관리
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm">
            글 작성, 수정, 삭제를 관리할 수 있습니다.
          </p>
        </Link>

        <div className="bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border)] p-6 hover:border-[var(--color-border-hover)] transition-colors">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
            태그 관리
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm">
            태그를 생성하고 관리할 수 있습니다.
          </p>
        </div>

        <div className="bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border)] p-6 hover:border-[var(--color-border-hover)] transition-colors">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
            댓글 관리
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm">
            댓글을 확인하고 관리할 수 있습니다.
          </p>
        </div>
      </div>

      {/* 최근 글 목록 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            최근 글
          </h2>
          <Link
            href="/dashboard/posts"
            className="text-sm text-[var(--color-primary)] hover:underline"
          >
            전체 보기 →
          </Link>
        </div>
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-8 bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border)]">
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
            posts.slice(0, 5).map((post) => (
              <PostCard
                key={post.id}
                post={post}
                href={`/dashboard/posts/${post.id}/edit`}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}

