import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedPosts } from '@/lib/supabase/posts';
import { getTagByName, getPublishedTagsWithCount } from '@/lib/supabase/tags';
import { TossPostItem } from '@/components/post/TossPostItem';
import { Pagination } from '@/components/post/Pagination';
import { TagBadge } from '@/components/tag/TagBadge';
import Link from 'next/link';

interface TagPageProps {
  params: Promise<{ tagName: string }>;
  searchParams: Promise<{ page?: string }>;
}

const POSTS_PER_PAGE = 10;

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tagName } = await params;
  const decodedTagName = decodeURIComponent(tagName);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yujunsun-blog.vercel.app';

  return {
    title: `태그: ${decodedTagName} | Yujunsun's Blog`,
    description: `"${decodedTagName}" 태그로 작성된 글 목록입니다.`,
    openGraph: {
      title: `태그: ${decodedTagName} | Yujunsun's Blog`,
      description: `"${decodedTagName}" 태그로 작성된 글 목록입니다.`,
      type: 'website',
      url: `${siteUrl}/tags/${encodeURIComponent(decodedTagName)}`,
    },
    alternates: {
      canonical: `${siteUrl}/tags/${encodeURIComponent(decodedTagName)}`,
    },
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { tagName } = await params;
  const { page } = await searchParams;
  const decodedTagName = decodeURIComponent(tagName);
  const currentPage = page ? parseInt(page, 10) : 1;

  // 태그 존재 확인
  const tag = await getTagByName(decodedTagName);
  if (!tag) {
    notFound();
  }

  // 해당 태그의 글 조회
  const posts = await getPublishedPosts(decodedTagName);
  
  // 페이지네이션
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  // 관련 태그 추천 (같은 글에 함께 사용된 태그들)
  const relatedTags = await getPublishedTagsWithCount();
  const relatedTagsFiltered = relatedTags
    .filter((t) => t.name !== decodedTagName && t.postCount > 0)
    .sort((a, b) => b.postCount - a.postCount)
    .slice(0, 10);

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)]">
      <div className="max-w-[var(--container-max-width)] mx-auto px-[var(--container-padding-x)] py-12">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/tags"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              ← 태그 목록으로
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)]">
              태그: {decodedTagName}
            </h1>
            <TagBadge name={decodedTagName} count={posts.length} size="lg" />
          </div>
          <p className="text-lg text-[var(--color-text-secondary)]">
            총 <span className="font-semibold text-[var(--color-text-primary)]">{posts.length}</span>개의 글이 있습니다.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* 메인 콘텐츠 */}
          <div className="flex-1">
            {/* 글 목록 */}
            {paginatedPosts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-lg text-[var(--color-text-secondary)] mb-2">
                  "{decodedTagName}" 태그로 작성된 글이 없습니다.
                </p>
                <Link
                  href="/tags"
                  className="inline-block mt-4 px-4 py-2 text-sm text-[var(--color-primary)] hover:underline"
                >
                  다른 태그 보기
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {paginatedPosts.map((post) => (
                  <TossPostItem key={post.id} post={post} />
                ))}
              </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages}
                  basePath={`/tags/${encodeURIComponent(decodedTagName)}`}
                />
              </div>
            )}
          </div>

          {/* 사이드바: 관련 태그 */}
          {relatedTagsFiltered.length > 0 && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                  관련 태그
                </h3>
                <div className="flex flex-wrap gap-2">
                  {relatedTagsFiltered.map((relatedTag) => (
                    <TagBadge
                      key={relatedTag.id}
                      name={relatedTag.name}
                      href={`/tags/${encodeURIComponent(relatedTag.name)}`}
                      count={relatedTag.postCount}
                      size="sm"
                    />
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </main>
  );
}

