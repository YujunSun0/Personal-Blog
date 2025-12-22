import { PostCard } from './PostCard';
import type { PostListItem } from '@/types/post';

interface PostsListProps {
  posts: PostListItem[];
  selectedTag?: string;
}

export function PostsList({ posts, selectedTag }: PostsListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📝</div>
        <p className="text-lg text-[var(--color-text-secondary)] mb-2">
          {selectedTag
            ? `"${selectedTag}" 태그로 작성된 글이 없습니다.`
            : '아직 작성된 글이 없습니다.'}
        </p>
        {selectedTag && (
          <p className="text-sm text-[var(--color-text-tertiary)]">
            다른 태그를 선택하거나 전체 글을 확인해보세요.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}



