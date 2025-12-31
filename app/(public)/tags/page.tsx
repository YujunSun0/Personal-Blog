import type { Metadata } from 'next';
import { getPublishedTagsWithCount } from '@/lib/supabase/tags';
import { TagCloud } from '@/components/tag/TagCloud';

export const metadata: Metadata = {
  title: '태그 목록 | Yujunsun\'s Blog',
  description: '블로그의 모든 태그를 확인하고 원하는 태그의 글을 찾아보세요.',
  openGraph: {
    title: '태그 목록 | Yujunsun\'s Blog',
    description: '블로그의 모든 태그를 확인하고 원하는 태그의 글을 찾아보세요.',
    type: 'website',
  },
};

export default async function TagsPage() {
  const tags = await getPublishedTagsWithCount();

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)]">
      <div className="max-w-[var(--container-max-width)] mx-auto px-[var(--container-padding-x)] py-12">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
            태그 목록
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            관심 있는 태그를 클릭하여 관련 글을 확인해보세요.
          </p>
        </div>

        {/* 태그 클라우드 */}
        <TagCloud tags={tags} />
      </div>
    </main>
  );
}

