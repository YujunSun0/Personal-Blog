'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type { TagWithCount } from '@/lib/supabase/tags';

interface TagsManagementProps {
  initialTags: TagWithCount[];
}

export function TagsManagement({ initialTags }: TagsManagementProps) {
  const [tags, setTags] = useState<TagWithCount[]>(initialTags);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [newTagName, setNewTagName] = useState('');

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      toast.error('태그 이름을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newTagName.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '태그 생성에 실패했습니다.');
      }

      const newTag = await response.json();
      setTags([...tags, { ...newTag, postCount: 0 }]);
      setNewTagName('');
      toast.success('태그가 생성되었습니다.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '태그 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (tag: TagWithCount) => {
    setEditingId(tag.id);
    setEditName(tag.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleUpdateTag = async (id: string) => {
    if (!editName.trim()) {
      toast.error('태그 이름을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/tags/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editName.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '태그 수정에 실패했습니다.');
      }

      const updatedTag = await response.json();
      setTags(tags.map((tag) => (tag.id === id ? { ...updatedTag, postCount: tag.postCount } : tag)));
      setEditingId(null);
      setEditName('');
      toast.success('태그가 수정되었습니다.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '태그 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTag = async (id: string, name: string) => {
    if (!confirm(`태그 "${name}"을(를) 삭제하시겠습니까?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/tags/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '태그 삭제에 실패했습니다.');
      }

      setTags(tags.filter((tag) => tag.id !== id));
      toast.success('태그가 삭제되었습니다.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '태그 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 태그 생성 폼 */}
      <div className="bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border)] p-6">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
          새 태그 생성
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateTag();
              }
            }}
            placeholder="태그 이름을 입력하세요"
            className="flex-1 px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            disabled={loading}
          />
          <button
            onClick={handleCreateTag}
            disabled={loading || !newTagName.trim()}
            className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            생성
          </button>
        </div>
      </div>

      {/* 태그 목록 */}
      <div className="bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border)]">
        <div className="p-6 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            태그 목록 ({tags.length})
          </h2>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {tags.length === 0 ? (
            <div className="p-6 text-center text-[var(--color-text-secondary)]">
              태그가 없습니다.
            </div>
          ) : (
            tags.map((tag) => (
              <div key={tag.id} className="p-4 flex items-center justify-between hover:bg-[var(--color-bg-secondary)] transition-colors">
                {editingId === tag.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdateTag(tag.id);
                        } else if (e.key === 'Escape') {
                          handleCancelEdit();
                        }
                      }}
                      className="flex-1 px-3 py-1 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      autoFocus
                    />
                    <button
                      onClick={() => handleUpdateTag(tag.id)}
                      disabled={loading}
                      className="px-3 py-1 text-sm bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-primary-hover)] disabled:opacity-50 transition-colors"
                    >
                      저장
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={loading}
                      className="px-3 py-1 text-sm border border-[var(--color-border)] rounded hover:bg-[var(--color-bg-secondary)] disabled:opacity-50 transition-colors"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <span className="font-medium text-[var(--color-text-primary)]">
                        {tag.name}
                      </span>
                      <span className="ml-2 text-sm text-[var(--color-text-secondary)]">
                        ({tag.postCount}개 글)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEdit(tag)}
                        disabled={loading}
                        className="px-3 py-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] disabled:opacity-50 transition-colors"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag.id, tag.name)}
                        disabled={loading || tag.postCount > 0}
                        className="px-3 py-1 text-sm text-[var(--color-error)] hover:bg-[var(--color-error-bg)] disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
                        title={tag.postCount > 0 ? '연결된 글이 있어 삭제할 수 없습니다.' : ''}
                      >
                        삭제
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

