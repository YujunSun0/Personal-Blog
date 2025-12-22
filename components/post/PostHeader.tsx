import type { Post } from '@/types/post';

interface PostHeaderProps {
  post: Post;
}

export function PostHeader({ post }: PostHeaderProps) {
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

      {/* 날짜 */}
      <div className="text-sm text-[var(--color-text-tertiary)]">
        {formatDate(post.createdAt)}
      </div>
    </header>
  );
}


