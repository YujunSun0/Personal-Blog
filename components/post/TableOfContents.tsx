'use client';

import { useEffect, useState } from 'react';
import type { TocItem } from '@/lib/utils/toc';

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (items.length === 0) return;

    const observerOptions = {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, observerOptions);

    // 모든 헤딩 요소 관찰
    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [items]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // 헤더 높이 고려
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // URL 해시 업데이트 (선택사항)
      window.history.pushState(null, '', `#${id}`);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="border border-[var(--color-border)] rounded-lg p-4 bg-[var(--color-bg-primary)] max-h-[calc(100vh-8rem)] overflow-y-auto">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
          이 글에서 다루는 내용
        </h3>
        <nav className="space-y-1">
          {items.map((item) => {
            const isActive = activeId === item.id;
            const indentClass = {
              1: 'pl-0',
              2: 'pl-3',
              3: 'pl-6',
              4: 'pl-9',
            }[item.level] || 'pl-0';

            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className={`block w-full text-left text-sm py-1.5 px-2 rounded transition-colors ${indentClass} ${
                  isActive
                    ? 'text-[var(--color-primary)] font-medium bg-[var(--color-primary-light)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]'
                }`}
              >
                {item.text}
              </button>
            );
          })}
        </nav>
    </div>
  );
}

