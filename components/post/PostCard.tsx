import Link from 'next/link';
import type { PostListItem } from '@/types/post';

interface PostCardProps {
  post: PostListItem;
  href?: string; // 커스텀 href (기본값: /posts/{id})
}

export function PostCard({ post, href }: PostCardProps) {
  const postHref = href || `/posts/${post.id}`;
  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'TECH':
        return 'bg-[var(--color-type-tech-bg)] text-[var(--color-type-tech)]';
      case 'TROUBLESHOOTING':
        return 'bg-[var(--color-type-trouble-bg)] text-[var(--color-type-trouble)]';
      case 'LIFE':
        return 'bg-[var(--color-type-life-bg)] text-[var(--color-type-life)]';
      default:
        return 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <Link href={postHref}>
      <article className="flex gap-6 p-6 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl transition-all hover:border-[var(--color-border-hover)] hover:shadow-md hover:translate-x-1 cursor-pointer">
        {/* 썸네일 */}
        <div className="flex-shrink-0 w-[280px] h-[180px] rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm overflow-hidden">
          {post.thumbnailUrl ? (
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>썸네일 이미지</span>
          )}
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* 타입 뱃지 */}
            <div className="mb-3">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeClass(
                  post.type
                )}`}
              >
                {post.type}
              </span>
            </div>

            {/* 제목 */}
            <h3 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-3 line-clamp-2">
              {post.title}
            </h3>

            {/* 설명 */}
            {post.description && (
              <p className="text-[var(--color-text-secondary)] text-[0.9375rem] leading-relaxed line-clamp-2 mb-4">
                {post.description}
              </p>
            )}
          </div>

          {/* 날짜 */}
          <div className="text-sm text-[var(--color-text-tertiary)]">
            {formatDate(post.createdAt)}
          </div>
        </div>
      </article>
    </Link>
  );
}

