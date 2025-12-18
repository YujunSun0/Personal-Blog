import { getPublishedPosts } from '@/lib/supabase/posts';
import { PostCard } from '@/components/post/PostCard';

export default async function Home() {
  const posts = await getPublishedPosts();

  return (
    <main className="max-w-[var(--container-max-width)] mx-auto px-[var(--container-padding-x)] py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
          개인 기술 블로그
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)]">
          기술 학습 및 실무 경험을 기록하는 공간입니다.
        </p>
      </div>

      {/* 글 목록 */}
      <div className="space-y-8">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--color-text-secondary)]">
              아직 작성된 글이 없습니다.
            </p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </main>
  );
}

