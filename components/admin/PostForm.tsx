'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { PostType } from '@/types/post';
import { MarkdownEditor } from './MarkdownEditor';

interface PostFormData {
  title: string;
  description: string;
  content: string;
  type: PostType;
  thumbnailUrl: string;
  isPublished: boolean;
  tags: string[];
}

interface PostFormProps {
  initialData?: Partial<PostFormData>;
  postId?: string;
}

export function PostForm({ initialData, postId }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [formData, setFormData] = useState<PostFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    type: initialData?.type || 'TECH',
    thumbnailUrl: initialData?.thumbnailUrl || '',
    isPublished: initialData?.isPublished ?? false,
    tags: initialData?.tags || [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !formData.tags.includes(tag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tag],
        }));
        setTagInput('');
      }
    } else if (e.key === 'Backspace' && tagInput === '' && formData.tags.length > 0) {
      setFormData((prev) => ({
        ...prev,
        tags: prev.tags.slice(0, -1),
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    setError(null);

    try {
      const url = postId ? `/api/posts/${postId}` : '/api/posts';
      const method = postId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          isPublished: false,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '임시저장에 실패했습니다.');
      }

      toast.success('임시저장 완료');
      setSaving(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '임시저장에 실패했습니다.');
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = postId ? `/api/posts/${postId}` : '/api/posts';
      const method = postId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          isPublished: true,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '글 출간에 실패했습니다.');
      }

      toast.success('글을 출간했습니다.');
      router.push('/dashboard/posts');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '글 출간에 실패했습니다.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-primary)]">
      {error && (
        <div className="p-4 bg-[var(--color-error-bg)] text-[var(--color-error)] border-b border-[var(--color-border)]">
          {error}
        </div>
      )}

      {/* 상단 헤더 영역 */}
      <div className="p-4 border-b border-[var(--color-border)] space-y-4">
        {/* 제목 입력 */}
        <input
          name="title"
          type="text"
          required
          value={formData.title}
          onChange={handleChange}
          className="w-full text-3xl font-bold bg-transparent border-none outline-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]"
          placeholder="제목을 입력하세요"
        />

        {/* 태그 입력 */}
        <div className="flex flex-wrap items-center gap-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--color-bg-secondary)] text-sm rounded text-[var(--color-text-primary)]"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-[var(--color-error)] transition-colors"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className="flex-1 min-w-[120px] px-2 py-1 bg-transparent border-none outline-none text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]"
            placeholder="태그를 입력하세요"
          />
        </div>
      </div>

      {/* 마크다운 에디터 영역 */}
      <div className="flex-1 overflow-hidden">
        <MarkdownEditor content={formData.content} onChange={handleContentChange} />
      </div>

      {/* 하단 푸터 영역 */}
      <div className="flex items-center justify-between p-4 border-t border-[var(--color-border)] bg-[var(--color-bg-primary)]">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            ← 나가기
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-4 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] disabled:opacity-50 transition-colors"
          >
            {saving ? '저장 중...' : '임시저장'}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="px-3 py-1.5 text-sm border border-[var(--color-border)] rounded bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="TECH">TECH</option>
            <option value="TROUBLESHOOTING">TROUBLESHOOTING</option>
            <option value="LIFE">LIFE</option>
          </select>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || !formData.title.trim() || !formData.content.trim()}
            className="px-6 py-2 bg-[var(--color-secondary)] text-white rounded-lg hover:bg-[var(--color-secondary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? '출간 중...' : '출간하기'}
          </button>
        </div>
      </div>

      {/* 숨겨진 폼 (타입 제출용) */}
      <form onSubmit={handleSubmit} className="hidden">
        <input type="submit" />
      </form>
    </div>
  );
}


