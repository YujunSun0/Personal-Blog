import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAllAlbums, createAlbum } from '@/lib/supabase/albums';
import { isAdmin } from '@/lib/supabase/profiles';

export async function GET() {
  try {
    const albums = await getAllAlbums();
    return NextResponse.json(albums);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '앨범 목록 조회 실패' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const album = await createAlbum({
      title: body.title,
      description: body.description,
      coverImageUrl: body.coverImageUrl,
      isPublished: body.isPublished ?? false,
    });

    return NextResponse.json(album, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '앨범 생성 실패' },
      { status: 500 }
    );
  }
}

