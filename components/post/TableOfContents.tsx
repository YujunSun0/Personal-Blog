'use client';

import { useEffect, useState, useRef } from 'react';
import type { TocItem } from '@/lib/utils/toc';

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    // 현재 뷰포트 상단에서 가장 가까운 헤딩 찾기
    const findActiveHeading = () => {
      const scrollPosition = window.scrollY + 80; // 헤더 높이 + 여유 공간

      // 모든 헤딩 요소의 위치 확인
      const headingPositions = items
        .map((item) => {
          const element = document.getElementById(item.id);
          if (!element) return null;
          return {
            id: item.id,
            top: element.getBoundingClientRect().top + window.scrollY,
          };
        })
        .filter((pos): pos is { id: string; top: number } => pos !== null);

      if (headingPositions.length === 0) return;

      // 스크롤 위치보다 위에 있는 헤딩 중 가장 가까운 것 찾기
      let newActiveId = headingPositions[0].id; // 기본값: 첫 번째 헤딩
      
      for (let i = headingPositions.length - 1; i >= 0; i--) {
        if (headingPositions[i].top <= scrollPosition) {
          newActiveId = headingPositions[i].id;
          break;
        }
      }

      setActiveId(newActiveId);
    };

    // 초기 실행
    findActiveHeading();

    // 스크롤 이벤트 리스너 (throttle 적용)
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          findActiveHeading();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [items]);

  // 활성화된 항목이 목차의 보이는 영역 밖에 있으면 자동 스크롤
  useEffect(() => {
    if (!activeId || !activeButtonRef.current || !containerRef.current) return;

    const button = activeButtonRef.current;
    const container = containerRef.current;

    // 버튼의 위치 확인 (컨테이너 기준 상대 위치)
    const buttonTop = button.offsetTop;
    const buttonBottom = buttonTop + button.offsetHeight;
    
    // 컨테이너의 스크롤 위치와 보이는 영역
    const containerScrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const visibleTop = containerScrollTop;
    const visibleBottom = containerScrollTop + containerHeight;

    // 버튼이 목차의 보이는 영역 밖에 있는지 확인
    const isAboveViewport = buttonTop < visibleTop;
    const isBelowViewport = buttonBottom > visibleBottom;

    if (isAboveViewport || isBelowViewport) {
      // 활성화된 버튼이 보이도록 스크롤
      if (isAboveViewport) {
        // 위에 있으면 버튼이 상단에 오도록
        container.scrollTo({
          top: buttonTop - 8, // 약간의 여유 공간
          behavior: 'smooth',
        });
      } else if (isBelowViewport) {
        // 아래에 있으면 버튼이 하단에 오도록
        container.scrollTo({
          top: buttonBottom - containerHeight + 8, // 약간의 여유 공간
          behavior: 'smooth',
        });
      }
    }
  }, [activeId]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // 헤더 높이 + 여유 공간 고려 (더 아래로 스크롤)
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
    <div ref={containerRef} className="border border-[var(--color-border)] rounded-lg p-4 bg-[var(--color-bg-primary)] max-h-[calc(100vh-8rem)] overflow-y-auto">
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
                ref={isActive ? activeButtonRef : null}
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

