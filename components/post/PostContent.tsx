'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import Image from 'next/image';
import 'highlight.js/styles/github-dark.css';

interface PostContentProps {
  content: string;
  thumbnailUrl?: string | null;
  title?: string;
}

export function PostContent({ content, thumbnailUrl, title }: PostContentProps) {
  return (
    <div className="markdown-content">
      {/* 썸네일 - 글 본문 첫 부분 */}
      {thumbnailUrl && (
        <div className="mb-8 rounded-2xl overflow-hidden">
          <div className="relative w-full" style={{ aspectRatio: '1200/628' }}>
            <Image
              src={thumbnailUrl}
              alt={title || 'Post thumbnail'}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
        </div>
      )}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeRaw, rehypeHighlight]}
        components={{
          // 커스텀 스타일링을 위한 컴포넌트 오버라이드
          h1: ({ node, id, ...props }) => (
            <h1 id={id} className="text-3xl font-bold mt-8 mb-4 text-[var(--color-text-primary)] scroll-mt-24" {...props} />
          ),
          h2: ({ node, id, ...props }) => (
            <h2 id={id} className="text-2xl font-bold mt-6 mb-3 text-[var(--color-text-primary)] scroll-mt-24" {...props} />
          ),
          h3: ({ node, id, ...props }) => (
            <h3 id={id} className="text-xl font-semibold mt-5 mb-2 text-[var(--color-text-primary)] scroll-mt-24" {...props} />
          ),
          h4: ({ node, id, ...props }) => (
            <h4 id={id} className="text-base font-semibold mt-3 mb-1 text-[var(--color-text-primary)] pb-2 scroll-mt-24" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-4 leading-relaxed text-[var(--color-text-primary)]" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc mb-4 space-y-2 text-[var(--color-text-primary)] ml-6" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal mb-4 space-y-2 text-[var(--color-text-primary)] ml-6" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-[var(--color-text-primary)] mb-1" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-[var(--color-primary)] pl-4 my-2 text-[var(--color-text-primary)] not-italic whitespace-pre-line"
              {...props}
            />
          ),
          code: ({ node, inline, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="inline-block bg-[var(--color-bg-secondary)] px-1.5 py-0.5 rounded text-sm font-mono text-[var(--color-text-primary)]"
                  {...props}
                />
              );
            }
            return (
              <code
                className="block bg-[var(--color-bg-secondary)] p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre"
                {...props}
              />
            );
          },
          pre: ({ node, ...props }) => (
            <pre className="mb-4 rounded-lg overflow-x-auto whitespace-pre" {...props} />
          ),
          a: ({ node, href, ...props }: any) => {
            // 앵커 링크인 경우 (같은 페이지 내 링크)
            const isAnchorLink = href && href.startsWith('#');
            
            const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
              if (isAnchorLink) {
                e.preventDefault();
                const targetId = href.substring(1); // # 제거
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                  // 부드러운 스크롤
                  targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                  
                  // URL 업데이트 (뒤로가기 지원)
                  window.history.pushState(null, '', `#${targetId}`);
                }
              }
            };
            
            return (
              <a
                className="text-blue-600 hover:text-blue-700 underline"
                href={href}
                onClick={handleClick}
                target={isAnchorLink ? undefined : '_blank'}
                rel={isAnchorLink ? undefined : 'noopener noreferrer'}
                {...props}
              />
            );
          },
          img: ({ node, ...props }) => (
            <img className="max-w-full h-auto rounded-lg my-4" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-[var(--color-border)]" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-[var(--color-bg-secondary)]" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="border border-[var(--color-border)] px-4 py-2 text-left font-semibold text-[var(--color-text-primary)]" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-[var(--color-border)] px-4 py-2 text-[var(--color-text-primary)]" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-8 border-[var(--color-border)]" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}


