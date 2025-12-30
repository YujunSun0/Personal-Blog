import type { Post } from '@/types/post';

interface PostHeaderProps {
  post: Post;
  isAdmin?: boolean;
}

export function PostHeader({ post, isAdmin = false }: PostHeaderProps) {
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
    <header className="mb-8">
      {/* 타입 뱃지 */}
      <div className="mb-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTypeBadgeClass(
            post.type
          )}`}
        >
          {post.type}
        </span>
      </div>

      {/* 제목 */}
      <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
        {post.title}
      </h1>

      {/* 설명 */}
      {post.description && (
        <p className="text-xl text-[var(--color-text-secondary)] mb-6">
          {post.description}
        </p>
      )}

      {/* 날짜 및 조회수 */}
      <div className="flex items-center gap-4 text-sm text-[var(--color-text-tertiary)]">
        <span>{formatDate(post.createdAt)}</span>
        {isAdmin && post.viewCount !== undefined && (
          <span className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
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
    </header>
  );
}


