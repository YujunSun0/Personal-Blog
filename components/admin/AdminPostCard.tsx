'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { PostListItem } from '@/types/post';
import { TagBadge } from '@/components/tag/TagBadge';
import { DeletePostButton } from './DeletePostButton';

interface AdminPostCardProps {
  post: PostListItem;
}

export function AdminPostCard({ post }: AdminPostCardProps) {
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
    <article className="group flex flex-col md:flex-row gap-6 p-6 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-2xl transition-all hover:border-[var(--color-border-hover)] hover:shadow-lg">
      {/* 썸네일 */}
      <Link 
        href={`/dashboard/posts/${post.id}/edit`}
        className="flex-shrink-0 w-full md:w-[280px] rounded-xl flex items-center justify-center text-sm overflow-hidden relative cursor-pointer"
        style={{ aspectRatio: '1200/628' }}
      >
        <div className={`w-full h-full ${
          post.thumbnailUrl 
            ? 'bg-[var(--color-bg-secondary)]' 
            : 'bg-gradient-to-br from-blue-400 to-purple-500 text-white'
        }`}>
          {post.thumbnailUrl ? (
            <Image
              src={post.thumbnailUrl}
              alt={post.title}
              fill
              className="object-contain rounded-xl group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 280px"
            />
          ) : (
            <span className="text-sm">썸네일 이미지</span>
          )}
        </div>
      </Link>

      {/* 콘텐츠 */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex-1">
          {/* 타입 뱃지 및 날짜 */}
          <div className="flex items-center justify-between mb-3">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeClass(
                post.type
              )}`}
            >
              {post.type}
            </span>
            <span className="text-xs text-[var(--color-text-tertiary)] hidden md:block">
              {formatDate(post.createdAt)}
            </span>
          </div>

          {/* 제목 */}
          <Link href={`/dashboard/posts/${post.id}/edit`}>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3 line-clamp-2 hover:text-[var(--color-primary)] transition-colors cursor-pointer">
              {post.title}
            </h3>
          </Link>

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

        {/* 하단 액션 영역 */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--color-border)]">
          {/* 날짜 (모바일) */}
          <div className="text-sm text-[var(--color-text-tertiary)] md:hidden">
            {formatDate(post.createdAt)}
          </div>
          
          {/* 액션 버튼들 */}
          <div className="flex items-center gap-3 ml-auto">
            <Link
              href={`/dashboard/posts/${post.id}/edit`}
              className="px-4 py-2 text-sm bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              수정
            </Link>
            <DeletePostButton postId={post.id} postTitle={post.title} />
          </div>
        </div>
      </div>
    </article>
  );
}

