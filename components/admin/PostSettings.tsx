'use client';

import { useState, useRef, useEffect } from 'react';
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
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const thumbnailFileInputRef = useRef<HTMLInputElement>(null);

  // 마크다운에서 첫 번째 이미지 URL 추출 함수
  const extractFirstImageUrl = (markdownContent: string): string | null => {
    if (!markdownContent) return null;

    // 마크다운 이미지 문법: ![alt](url) 또는 ![alt](url "title")
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/;
    const match = markdownContent.match(imageRegex);
    
    if (match && match[2]) {
      // URL에서 따옴표나 공백 제거
      const url = match[2].trim().replace(/^["']|["']$/g, '');
      return url;
    }

    return null;
  };

  // content가 변경될 때 썸네일이 없으면 첫 번째 이미지로 자동 설정
  useEffect(() => {
    if (!thumbnailUrl && content) {
      const firstImageUrl = extractFirstImageUrl(content);
      if (firstImageUrl) {
        setThumbnailUrl(firstImageUrl);
      }
    }
  }, [content, thumbnailUrl]);

  const handleThumbnailUpload = async (file: File) => {
    setUploadingThumbnail(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'thumbnails');

      const uploadResponse = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || '썸네일 업로드 실패');
      }

      const { url } = await uploadResponse.json();
      setThumbnailUrl(url);
      toast.success('썸네일이 업로드되었습니다.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '썸네일 업로드에 실패했습니다.');
    } finally {
      setUploadingThumbnail(false);
      if (thumbnailFileInputRef.current) {
        thumbnailFileInputRef.current.value = '';
      }
    }
  };

  const handleThumbnailFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    await handleThumbnailUpload(file);
  };

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
    <div className="flex flex-col h-full bg-[var(--color-bg-primary)] min-h-[calc(100vh-63px)]">
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
            <div className="w-full h-64 bg-[var(--color-bg-secondary)] rounded-lg flex items-center justify-center mb-4 overflow-hidden relative">
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
              {uploadingThumbnail && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white text-sm">업로드 중...</div>
                </div>
              )}
            </div>
            <div className="flex gap-2 mb-2">
              <input
                ref={thumbnailFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => thumbnailFileInputRef.current?.click()}
                disabled={uploadingThumbnail}
                className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {uploadingThumbnail ? '업로드 중...' : '이미지 업로드'}
              </button>
              {content && (
                <button
                  type="button"
                  onClick={() => {
                    const firstImageUrl = extractFirstImageUrl(content);
                    if (firstImageUrl) {
                      setThumbnailUrl(firstImageUrl);
                      toast.success('글의 첫 번째 이미지로 설정되었습니다.');
                    } else {
                      toast.info('글에서 이미지를 찾을 수 없습니다.');
                    }
                  }}
                  className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] transition-colors text-sm"
                  title="글의 첫 번째 이미지를 썸네일로 사용"
                >
                  글에서 추출
                </button>
              )}
              {thumbnailUrl && (
                <button
                  type="button"
                  onClick={() => setThumbnailUrl('')}
                  className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] transition-colors text-sm"
                >
                  제거
                </button>
              )}
            </div>
            <input
              type="text"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="또는 썸네일 이미지 URL을 직접 입력하세요"
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

