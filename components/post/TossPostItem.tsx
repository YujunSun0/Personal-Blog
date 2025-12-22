import Link from 'next/link';
import type { PostListItem } from '@/types/post';

interface TossPostItemProps {
  post: PostListItem;
}

export function TossPostItem({ post }: TossPostItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <Link href={`/posts/${post.id}`}>
      <article className="group flex gap-6 py-6 border-b border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] transition-colors cursor-pointer">
        {/* 콘텐츠 영역 */}
        <div className="flex-1 min-w-0">
          {/* 제목 */}
          <h3 className="text-lg md:text-xl font-semibold text-[var(--color-text-primary)] mb-2 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
            {post.title}
          </h3>

          {/* 설명 */}
          {post.description && (
            <p className="text-sm md:text-base text-[var(--color-text-secondary)] mb-4 line-clamp-2 leading-relaxed">
              {post.description}
            </p>
          )}

          {/* 날짜 */}
          <div className="text-sm text-[var(--color-text-tertiary)]">
            {formatDate(post.createdAt)}
          </div>
        </div>

        {/* 썸네일 */}
        <div className={`flex-shrink-0 w-32 md:w-40 h-24 md:h-28 rounded-lg overflow-hidden ${
          post.thumbnailUrl 
            ? 'bg-gray-50' 
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

