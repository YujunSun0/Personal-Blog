import { getPublishedPosts } from '@/lib/supabase/posts';
import { getPublishedTagsWithCount } from '@/lib/supabase/tags';
import { TabNavigation } from '@/components/post/TabNavigation';
import { TossPostItem } from '@/components/post/TossPostItem';
import { Pagination } from '@/components/post/Pagination';
import { TagFilter } from '@/components/tag/TagFilter';
import type { PostType } from '@/types/post';

interface HomeProps {
  searchParams: Promise<{ tag?: string; type?: string; page?: string }>;
}

const POSTS_PER_PAGE = 10;

export default async function Home({ searchParams }: HomeProps) {
  const { tag, type, page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;
  const postType = (type as PostType) || undefined;
  
  // 모든 글 조회 (타입별 개수 계산용)
  const allPosts = await getPublishedPosts();
  const filteredPosts = await getPublishedPosts(tag || undefined, postType);
  const tags = await getPublishedTagsWithCount();
  
  // 타입별 개수 계산
  const typeCounts = {
    TECH: allPosts.filter((p) => p.type === 'TECH').length,
    TROUBLESHOOTING: allPosts.filter((p) => p.type === 'TROUBLESHOOTING').length,
    PROJECT: allPosts.filter((p) => p.type === 'PROJECT').length,
    total: allPosts.length,
  };
  
  // 페이지네이션
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* 히어로 섹션 */}
      {!tag && !type && (
        <section 
          className="relative border-b border-[var(--color-border)] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/blog_banner.png)' }}
        >
          {/* 오버레이 (텍스트 가독성을 위한 어두운 레이어) */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* 콘텐츠 */}
          <div className="relative max-w-[var(--container-max-width)] mx-auto px-[var(--container-padding-x)] py-20 md:py-28">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                기술 블로그
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 drop-shadow-md">
                기술 학습 및 실무 경험을 기록하는 공간입니다.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 메인 콘텐츠 */}
      <div className="max-w-[var(--container-max-width)] mx-auto px-[var(--container-padding-x)] py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* 좌측: 메인 콘텐츠 */}
          <div className="flex-1">
            {/* 탭 네비게이션 */}
            <TabNavigation typeCounts={typeCounts} />

            {/* 게시글 목록 */}
            <div className="mb-8">
              {paginatedPosts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-lg text-[var(--color-text-secondary)] mb-2">
                    {tag
                      ? `"${tag}" 태그로 작성된 글이 없습니다.`
                      : type
                      ? '해당 타입의 글이 없습니다.'
                      : '아직 작성된 글이 없습니다.'}
                  </p>
                </div>
              ) : (
                <div>
                  {paginatedPosts.map((post) => (
                    <TossPostItem key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>

            {/* 페이지네이션 */}
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </div>

          {/* 우측: 태그 필터 사이드바 */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                태그
              </h3>
              <TagFilter tags={tags} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

