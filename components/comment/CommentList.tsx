'use client';

import { useState, useEffect } from 'react';
import { CommentWithAuthor } from '@/types/comment';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';

interface CommentListProps {
  postId: string;
}

export function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/comments?postId=${postId}`);
      if (!response.ok) {
        throw new Error('댓글을 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '댓글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleCommentAdded = () => {
    fetchComments();
  };

  const handleCommentUpdated = () => {
    fetchComments();
  };

  const handleCommentDeleted = () => {
    fetchComments();
  };

  if (loading) {
    return (
      <div className="py-8 text-center text-[var(--color-text-secondary)]">
        댓글을 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
        댓글 {comments.length}
      </h2>

      <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />

      <div className="mt-8 space-y-6">
        {comments.length === 0 ? (
          <div className="py-8 text-center text-[var(--color-text-tertiary)]">
            아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onCommentUpdated={handleCommentUpdated}
              onCommentDeleted={handleCommentDeleted}
            />
          ))
        )}
      </div>
    </div>
  );
}

