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
      <div className="mt-12">
        <div className="h-8 bg-[var(--color-bg-secondary)] rounded w-32 mb-6 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 border border-[var(--color-border)] rounded-lg space-y-2"
            >
              <div className="flex items-center gap-2">
                <div className="h-4 w-24 bg-[var(--color-bg-secondary)] rounded animate-pulse" />
                <div className="h-4 w-20 bg-[var(--color-bg-secondary)] rounded animate-pulse" />
              </div>
              <div className="h-4 bg-[var(--color-bg-secondary)] rounded w-full animate-pulse" />
              <div className="h-4 bg-[var(--color-bg-secondary)] rounded w-3/4 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12">
        <div className="p-4 bg-[var(--color-error-bg)] border border-[var(--color-error)] rounded-lg">
          <p className="text-[var(--color-error)] text-sm">
            {error}
          </p>
          <button
            onClick={fetchComments}
            className="mt-2 text-sm text-[var(--color-error)] hover:underline"
          >
            다시 시도
          </button>
        </div>
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

