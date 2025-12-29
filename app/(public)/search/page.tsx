import type { Metadata } from 'next';
import { searchPublishedPosts } from '@/lib/supabase/posts';
import { TossPostItem } from '@/components/post/TossPostItem';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yujunsun-blog.vercel.app';
  
  if (q) {
    return {
      title: `검색: ${q} | Yujunsun's Blog`,
      description: `"${q}" 검색 결과입니다.`,
    };
  }
  
  return {
    title: '검색 | Yujunsun\'s Blog',
    description: '블로그 검색',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const searchQuery = q?.trim() || '';
  
  const posts = searchQuery ? await searchPublishedPosts(searchQuery) : [];

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)]">
      <div className="container-width mx-auto container-padding-x py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
            {searchQuery ? `"${searchQuery}" 검색 결과` : '검색'}
          </h1>
          {searchQuery && (
            <p className="text-[var(--color-text-secondary)]">
              {posts.length}개의 결과를 찾았습니다
            </p>
          )}
        </div>

        {!searchQuery ? (
          <div className="text-center py-20">
            <p className="text-lg text-[var(--color-text-secondary)]">
              검색어를 입력해주세요
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg text-[var(--color-text-secondary)] mb-2">
              검색 결과가 없습니다
            </p>
            <p className="text-sm text-[var(--color-text-tertiary)]">
              다른 검색어로 시도해보세요
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <TossPostItem key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

