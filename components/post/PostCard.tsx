'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { PostListItem } from '@/types/post';
import { TagBadge } from '@/components/tag/TagBadge';
import { useAuth } from '@/hooks/useAuth';

interface PostCardProps {
  post: PostListItem;
  href?: string; // 커스텀 href (기본값: /posts/{id})
}

export function PostCard({ post, href }: PostCardProps) {
  const { isAdmin } = useAuth();
  const postHref = href || `/posts/${post.id}`;
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <Link href={postHref}>
      <article className="group flex flex-col md:flex-row gap-6 p-6 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-2xl transition-all hover:border-[var(--color-border-hover)] hover:shadow-lg hover:-translate-y-1 cursor-pointer">
        {/* 썸네일 */}
        <div className={`flex-shrink-0 w-full md:w-[280px] h-[200px] md:h-[180px] rounded-xl flex items-center justify-center text-sm overflow-hidden relative ${
          post.thumbnailUrl 
            ? 'bg-[var(--color-bg-secondary)]' 
            : 'bg-gradient-to-br from-blue-400 to-purple-500 text-white'
        }`}>
          {post.thumbnailUrl ? (
            <Image
              src={post.thumbnailUrl}
              alt={post.title}
              fill
              className="object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 280px"
            />
          ) : (
            <span className="text-sm">썸네일 이미지</span>
          )}  
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* 타입 뱃지 및 날짜/조회수 */}
            <div className="flex items-center justify-between mb-3">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeClass(
                  post.type
                )}`}
              >
                {post.type}
              </span>
              <div className="flex items-center gap-3 text-xs text-[var(--color-text-tertiary)] hidden md:flex">
                <span>{formatDate(post.createdAt)}</span>
                {isAdmin && post.viewCount !== undefined && (
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    {post.viewCount.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* 제목 */}
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
              {post.title}
            </h3>

            {/* 설명 */}
            {post.description && (
              <p className="text-[var(--color-text-secondary)] text-[0.9375rem] leading-relaxed line-clamp-2 mb-4">
                {post.description}
              </p>
            )}

            {/* 태그 */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
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
          </div>

          {/* 날짜 (모바일) */}
          <div className="text-sm text-[var(--color-text-tertiary)] md:hidden">
            {formatDate(post.createdAt)}
          </div>
        </div>
      </article>
    </Link>
  );
}

