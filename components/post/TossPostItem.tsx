import Link from 'next/link';
import type { PostListItem } from '@/types/post';
import { TagBadge } from '@/components/tag/TagBadge';

interface TossPostItemProps {
  post: PostListItem;
}

export function TossPostItem({ post }: TossPostItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'TECH':
        return 'bg-[var(--color-type-tech-bg)] text-[var(--color-type-tech)]';
      case 'TROUBLESHOOTING':
        return 'bg-[var(--color-type-trouble-bg)] text-[var(--color-type-trouble)]';
      case 'PROJECT':
        return 'bg-[var(--color-type-life-bg)] text-[var(--color-type-life)]';
      default:
        return 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]';
    }
  };

  return (
    <Link href={`/posts/${post.id}`}>
      <article className="group flex flex-col-reverse md:flex-row gap-6 py-6 border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-bg-secondary)]">
        {/* 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* 제목 */}
            <h3 className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)] mb-2 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
              {post.title}
            </h3>

            {/* 설명 */}
            {post.description && (
              <p className="text-[var(--color-text-secondary)] text-[0.9375rem] leading-relaxed line-clamp-2 mb-3">
                {post.description}
              </p>
            )}

            {/* 태그 */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {post.tags.slice(0, 4).map((tag) => (
                  <TagBadge key={tag.id} name={tag.name} size="sm" />
                ))}
                {post.tags.length > 4 && (
                  <span className="text-xs text-[var(--color-text-tertiary)] px-2 py-1">
                    +{post.tags.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* 날짜 및 타입 뱃지 */}
            <div className="flex items-center gap-3 text-sm text-[var(--color-text-tertiary)]">
              <span>{formatDate(post.createdAt)}</span>
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeClass(
                  post.type
                )}`}
              >
                {post.type}
              </span>
            </div>
          </div>
        </div>

        {/* 썸네일 */}
        <div className={`flex-shrink-0 w-32 md:w-40 h-24 md:h-28 rounded-lg overflow-hidden ${
          post.thumbnailUrl 
            ? 'bg-[var(--color-bg-secondary)]' 
            : 'bg-gradient-to-br from-blue-400 to-purple-500'
        }`}>
          {post.thumbnailUrl ? (
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-xs">
              이미지
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

