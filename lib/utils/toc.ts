export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * 마크다운 콘텐츠에서 헤딩(h1-h4)을 추출하여 목차 데이터 생성
 */
export function extractTocFromMarkdown(content: string): TocItem[] {
  const toc: TocItem[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    // 마크다운 헤딩 패턴 매칭 (# ## ### ####)
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      
      // ID 생성 (rehype-slug와 호환되는 방식)
      // rehype-slug는 기본적으로 소문자, 공백을 하이픈으로, 특수문자 제거
      const id = text
        .toLowerCase()
        .trim()
        .replace(/[^\w가-힣\s-]/g, '') // 특수문자 제거 (한글, 영문, 숫자, 하이픈만 허용)
        .replace(/\s+/g, '-') // 공백을 하이픈으로
        .replace(/-+/g, '-') // 연속된 하이픈을 하나로
        .replace(/^-+|-+$/g, ''); // 앞뒤 하이픈 제거
      
      if (id) {
        toc.push({
          id,
          text,
          level,
        });
      }
    }
  }
  
  return toc;
}

