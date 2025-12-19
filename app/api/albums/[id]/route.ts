import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAlbumById, updateAlbum, deleteAlbum } from '@/lib/supabase/albums';
import { isAdmin } from '@/lib/supabase/profiles';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const album = await getAlbumById(id);
    if (!album) {
      return NextResponse.json({ error: '앨범을 찾을 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json(album);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '앨범 조회 실패' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    if (!(await isAdmin(user.id))) {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const album = await updateAlbum(id, {
      title: body.title,
      description: body.description,
      coverImageUrl: body.coverImageUrl,
      isPublished: body.isPublished,
    });

    return NextResponse.json(album);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '앨범 수정 실패' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    if (!(await isAdmin(user.id))) {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    const { id } = await params;
    await deleteAlbum(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '앨범 삭제 실패' },
      { status: 500 }
    );
  }
}

