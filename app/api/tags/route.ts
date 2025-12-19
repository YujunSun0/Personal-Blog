import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createTag, getAllTags } from '@/lib/supabase/tags';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tags = await getAllTags();
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

// 태그는 글 작성 시에만 생성됩니다.
// 이 API는 비활성화되었습니다.
export async function POST(request: Request) {
  return NextResponse.json(
    { error: '태그는 글 작성 시에만 생성할 수 있습니다.' },
    { status: 403 }
  );
}

