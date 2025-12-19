import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateTag, deleteTag } from '@/lib/supabase/tags';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// 태그는 글 작성 시에만 생성되며, 수정/삭제할 수 없습니다.
// 글 삭제 시 연결된 태그는 자동으로 정리됩니다.
export async function PUT(request: Request, { params }: RouteParams) {
  return NextResponse.json(
    { error: '태그는 수정할 수 없습니다. 글 작성 시에만 생성됩니다.' },
    { status: 403 }
  );
}

export async function DELETE(request: Request, { params }: RouteParams) {
  return NextResponse.json(
    { error: '태그는 삭제할 수 없습니다. 연결된 글이 모두 삭제되면 자동으로 정리됩니다.' },
    { status: 403 }
  );
}

