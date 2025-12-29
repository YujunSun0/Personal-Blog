import { NextResponse } from 'next/server';
import { getPublishedTagsWithCount } from '@/lib/supabase/tags';

/**
 * 공개 태그 목록 조회 (인증 불필요)
 * 최신순으로 최대 10개 반환
 */
export async function GET() {
  try {
    const tags = await getPublishedTagsWithCount();
    
    // 최신순 정렬 (생성일 기준이 아니라 글 개수 많은 순으로)
    // 실제로는 최신 태그를 가져오려면 태그 생성일이 필요하지만,
    // 현재 스키마에는 없으므로 글 개수 많은 순으로 정렬
    const sortedTags = tags
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 10);
    
    return NextResponse.json(sortedTags);
  } catch (error) {
    console.error('Error fetching public tags:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

