'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { CategoryWithCount } from '@/lib/supabase/categories';
import { isBlank, trimOrNull, trimOrEmpty } from '@/lib/utils/string';

interface CategoriesManagementProps {
  initialCategories: CategoryWithCount[];
}

export function CategoriesManagement({ initialCategories }: CategoriesManagementProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryWithCount[]>(initialCategories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    order: 0,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      order: 0,
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleCreate = async () => {
    if (isBlank(formData.name) || isBlank(formData.slug)) {
      toast.error('이름과 slug는 필수입니다.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimOrEmpty(formData.name),
          slug: trimOrEmpty(formData.slug),
          description: trimOrNull(formData.description),
          order: formData.order || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '카테고리 생성에 실패했습니다.');
      }

      const newCategory = await response.json();
      setCategories([...categories, { ...newCategory, postCount: 0 }]);
      resetForm();
      toast.success('카테고리가 생성되었습니다.');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '카테고리 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (isBlank(formData.name) || isBlank(formData.slug)) {
      toast.error('이름과 slug는 필수입니다.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimOrEmpty(formData.name),
          slug: trimOrEmpty(formData.slug),
          description: trimOrNull(formData.description),
          order: formData.order,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '카테고리 수정에 실패했습니다.');
      }

      const updatedCategory = await response.json();
      setCategories(
        categories.map((cat) =>
          cat.id === id ? { ...updatedCategory, postCount: cat.postCount } : cat
        )
      );
      resetForm();
      toast.success('카테고리가 수정되었습니다.');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '카테고리 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 이 카테고리를 삭제하시겠습니까?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '카테고리 삭제에 실패했습니다.');
      }

      setCategories(categories.filter((cat) => cat.id !== id));
      toast.success('카테고리가 삭제되었습니다.');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '카테고리 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (category: CategoryWithCount) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      order: category.order,
    });
    setEditingId(category.id);
    setIsCreating(false);
  };

  const startCreate = () => {
    const maxOrder = categories.length > 0 ? Math.max(...categories.map((c) => c.order)) : 0;
    resetForm();
    setFormData((prev) => ({ ...prev, order: maxOrder + 1 }));
    setIsCreating(true);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* 생성/수정 폼 */}
      {(isCreating || editingId) && (
        <div className="bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
            {isCreating ? '새 카테고리 생성' : '카테고리 수정'}
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
              >
                이름 *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="예: 개발"
              />
            </div>
            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
              >
                Slug * (대문자, 예: TECH)
              </label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value.toUpperCase() })
                }
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="예: TECH"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
              >
                설명
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-y"
                placeholder="카테고리에 대한 설명을 입력하세요"
              />
            </div>
            <div>
              <label
                htmlFor="order"
                className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
              >
                정렬 순서
              </label>
              <input
                type="number"
                id="order"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="0"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => (isCreating ? handleCreate() : editingId && handleUpdate(editingId))}
                disabled={loading}
                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? '처리 중...' : isCreating ? '생성' : '수정'}
              </button>
              <button
                onClick={resetForm}
                disabled={loading}
                className="px-4 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 카테고리 목록 */}
      <div className="bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border)]">
        <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            카테고리 목록 ({categories.length})
          </h2>
          {!isCreating && !editingId && (
            <button
              onClick={startCreate}
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-colors text-sm"
            >
              + 새 카테고리
            </button>
          )}
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {categories.length === 0 ? (
            <div className="p-6 text-center text-[var(--color-text-secondary)]">
              카테고리가 없습니다. 새 카테고리를 생성해보세요.
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="p-4 flex items-center justify-between hover:bg-[var(--color-bg-secondary)] transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {category.name}
                    </span>
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      ({category.slug})
                    </span>
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      {category.postCount}개 글
                    </span>
                    <span className="text-xs text-[var(--color-text-tertiary)]">
                      순서: {category.order}
                    </span>
                  </div>
                  {category.description && (
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      {category.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(category)}
                    disabled={loading || editingId !== null}
                    className="px-3 py-1 text-sm bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded hover:bg-[var(--color-bg-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    disabled={loading || category.postCount > 0}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title={
                      category.postCount > 0
                        ? '이 카테고리를 사용하는 글이 있어 삭제할 수 없습니다.'
                        : '삭제'
                    }
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

