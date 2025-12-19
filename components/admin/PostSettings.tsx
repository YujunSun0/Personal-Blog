'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type { PostType } from '@/types/post';

interface PostSettingsProps {
  title: string;
  content: string;
  description: string;
  type: PostType;
  thumbnailUrl: string;
  isPublished: boolean;
  tags: string[];
  onCancel: () => void;
  onPublish: (settings: {
    description: string;
    thumbnailUrl: string;
    isPublished: boolean;
  }) => void;
}

export function PostSettings({
  title,
  content,
  description: initialDescription,
  type,
  thumbnailUrl: initialThumbnailUrl,
  isPublished: initialIsPublished,
  tags,
  onCancel,
  onPublish,
}: PostSettingsProps) {
  const [description, setDescription] = useState(initialDescription);
  const [thumbnailUrl, setThumbnailUrl] = useState(initialThumbnailUrl);
  const [isPublished, setIsPublished] = useState(initialIsPublished);
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    setLoading(true);
    try {
      await onPublish({
        description,
        thumbnailUrl,
        isPublished,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-primary)]">
      <div className="flex flex-1 overflow-hidden">
        {/* 포스트 미리보기 및 설정 */}
        <div className="flex flex-1 px-16 py-12 gap-12 overflow-hidden max-w-[1024px] mx-auto">
          {/* 왼쪽: 포스트 미리보기 */}
          <div className="flex-1 overflow-y-auto">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">
            포스트 미리보기
          </h2>

          {/* 썸네일 */}
          <div className="mb-6">
            <div className="w-full h-64 bg-[var(--color-bg-secondary)] rounded-lg flex items-center justify-center mb-4 overflow-hidden">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt="썸네일"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-[var(--color-text-tertiary)]">
                  <svg
                    className="w-16 h-16 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm">썸네일 이미지</p>
                </div>
              )}
            </div>
            <input
              type="text"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="썸네일 이미지 URL을 입력하세요"
              className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
            />
          </div>

          {/* 설명 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              포스트 설명
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 150) {
                  setDescription(value);
                }
              }}
              placeholder="당신의 포스트를 짧게 소개해보세요."
              className="w-full h-24 px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] resize-none"
              maxLength={150}
            />
            <div className="text-right text-sm text-[var(--color-text-tertiary)] mt-1">
              {description.length}/150
            </div>
          </div>

          {/* 미리보기 정보 */}
          <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4">
            <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                {description}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          </div>

          {/* 오른쪽: 설정 */}
          <div className="w-96 overflow-y-auto flex-shrink-0">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">
              설정
            </h2>

            {/* 공개 설정 */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
                공개 설정
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPublished(true)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                    isPublished
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                      : 'bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  <span className="text-sm font-medium">전체 공개</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPublished(false)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                    !isPublished
                      ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border-[var(--color-border)]'
                      : 'bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span className="text-sm font-medium">비공개</span>
                </button>
              </div>
            </div>

            {/* URL 설정 (추후 구현) */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
                URL 설정
              </h3>
              <div className="px-4 py-3 bg-[var(--color-bg-secondary)] rounded-lg text-sm text-[var(--color-text-secondary)]">
                /posts/{title.toLowerCase().replace(/\s+/g, '-')}
              </div>
              <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">
                URL은 자동으로 생성됩니다.
              </p>
            </div>

            {/* 시리즈 설정 (추후 구현) */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
                시리즈 설정
              </h3>
              <button
                type="button"
                onClick={() => toast.info('준비중인 기능입니다.')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <span className="text-sm">+ 시리즈에 추가하기</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="p-6 bg-[var(--color-bg-primary)] border-t border-[var(--color-border)] flex justify-end gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-2 border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] disabled:opacity-50 transition-colors"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handlePublish}
          disabled={loading}
          className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '출간 중...' : '출간하기'}
        </button>
      </div>
    </div>
  );
}

