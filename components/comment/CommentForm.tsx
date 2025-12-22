'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface CommentFormProps {
  postId: string;
  onCommentAdded: () => void;
}

export function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [password, setPassword] = useState('');
  const [isGuest, setIsGuest] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsGuest(!user);
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error('댓글 내용을 입력해주세요.');
      return;
    }

    if (content.length > 2000) {
      toast.error('댓글은 2000자 이하여야 합니다.');
      return;
    }

    if (isGuest) {
      if (!authorName.trim()) {
        toast.error('이름을 입력해주세요.');
        return;
      }
      if (!password.trim()) {
        toast.error('비밀번호를 입력해주세요.');
        return;
      }
      if (password.length < 4) {
        toast.error('비밀번호는 4자 이상이어야 합니다.');
        return;
      }
    }

    setLoading(true);

    try {
      const body: any = {
        postId,
        content: content.trim(),
      };

      if (isGuest) {
        body.authorName = authorName.trim();
        body.password = password;
      }

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '댓글 작성에 실패했습니다.');
      }

      toast.success('댓글이 작성되었습니다.');
      setContent('');
      setAuthorName('');
      setPassword('');
      onCommentAdded();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '댓글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isGuest && (
        <div className="flex gap-4">
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="이름"
            maxLength={20}
            className="flex-1 px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 (4자 이상)"
            minLength={4}
            className="flex-1 px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
          />
        </div>
      )}
      <div>
        <textarea
          value={content}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 2000) {
              setContent(value);
            }
          }}
          placeholder="댓글을 입력하세요..."
          rows={4}
          className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] resize-none"
          maxLength={2000}
        />
        <div className="text-right text-sm text-[var(--color-text-tertiary)] mt-1">
          {content.length}/2000
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '작성 중...' : '댓글 작성'}
        </button>
      </div>
    </form>
  );
}

