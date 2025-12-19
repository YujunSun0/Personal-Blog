import { PostCard } from './PostCard';
import type { PostListItem } from '@/types/post';

interface PostsListProps {
  posts: PostListItem[];
  selectedTag?: string;
}

export function PostsList({ posts, selectedTag }: PostsListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-text-secondary)]">
          {selectedTag
            ? `"${selectedTag}" 태그로 작성된 글이 없습니다.`
            : '아직 작성된 글이 없습니다.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}



