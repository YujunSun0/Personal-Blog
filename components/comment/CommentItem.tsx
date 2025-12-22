'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CommentWithAuthor } from '@/types/comment';
import { createClient } from '@/lib/supabase/client';

interface CommentItemProps {
  comment: CommentWithAuthor;
  onCommentUpdated: () => void;
  onCommentDeleted: () => void;
}

export function CommentItem({ comment, onCommentUpdated, onCommentDeleted }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(!comment.authorId);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsGuest(!user || comment.authorId !== user.id);
    };
    checkAuth();
  }, [comment.authorId]);

  const handleUpdate = async () => {
    if (!content.trim()) {
      toast.error('댓글 내용을 입력해주세요.');
      return;
    }

    if (content.length > 2000) {
      toast.error('댓글은 2000자 이하여야 합니다.');
      return;
    }

    if (isGuest && !password.trim()) {
      toast.error('비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const body: any = {
        content: content.trim(),
      };

      if (isGuest) {
        body.password = password;
      }

      const response = await fetch(`/api/comments/${comment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '댓글 수정에 실패했습니다.');
      }

      toast.success('댓글이 수정되었습니다.');
      setIsEditing(false);
      setPassword('');
      onCommentUpdated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '댓글 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isDeleting) {
      setIsDeleting(true);
      return;
    }

    if (isGuest && !password.trim()) {
      toast.error('비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const body: any = {};
      if (isGuest) {
        body.password = password;
      }

      const response = await fetch(`/api/comments/${comment.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '댓글 삭제에 실패했습니다.');
      }

      toast.success('댓글이 삭제되었습니다.');
      onCommentDeleted();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '댓글 삭제에 실패했습니다.');
      setIsDeleting(false);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;

    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="border-b border-[var(--color-border)] pb-6">
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="font-semibold text-[var(--color-text-primary)]">
            {comment.authorNickname || comment.authorName || '익명'}
          </span>
          <span className="ml-2 text-sm text-[var(--color-text-tertiary)]">
            {formatDate(comment.createdAt)}
            {comment.updatedAt !== comment.createdAt && ' (수정됨)'}
          </span>
        </div>
        {!isGuest && (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="text-sm text-[var(--color-primary)] hover:underline disabled:opacity-50"
                >
                  저장
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setContent(comment.content);
                    setPassword('');
                  }}
                  disabled={loading}
                  className="text-sm text-[var(--color-text-secondary)] hover:underline disabled:opacity-50"
                >
                  취소
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-[var(--color-text-secondary)] hover:underline"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="text-sm text-red-500 hover:underline"
                >
                  삭제
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 2000) {
                setContent(value);
              }
            }}
            rows={4}
            className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] resize-none"
            maxLength={2000}
          />
          {isGuest && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
            />
          )}
        </div>
      ) : (
        <div className="text-[var(--color-text-primary)] whitespace-pre-wrap">
          {comment.content}
        </div>
      )}

      {isDeleting && !isEditing && (
        <div className="mt-4 p-4 bg-[var(--color-bg-secondary)] rounded-lg">
          <p className="text-sm text-[var(--color-text-secondary)] mb-2">
            정말 삭제하시겠습니까?
          </p>
          {isGuest && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] mb-2"
            />
          )}
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 text-sm"
            >
              {loading ? '삭제 중...' : '삭제'}
            </button>
            <button
              onClick={() => {
                setIsDeleting(false);
                setPassword('');
              }}
              disabled={loading}
              className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] disabled:opacity-50 text-sm"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

