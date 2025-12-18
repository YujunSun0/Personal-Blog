'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          // 커스텀 스타일링을 위한 컴포넌트 오버라이드
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl font-bold mt-8 mb-4 text-[var(--color-text-primary)]" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-bold mt-6 mb-3 text-[var(--color-text-primary)]" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-semibold mt-5 mb-2 text-[var(--color-text-primary)]" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-base font-semibold mt-3 mb-1 text-[var(--color-text-primary)] pb-2" {...props} />
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
          a: ({ node, ...props }) => (
            <a
              className="text-blue-600 hover:text-blue-700 underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
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


