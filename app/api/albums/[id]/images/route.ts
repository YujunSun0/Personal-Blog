import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { addAlbumImage, getAlbumImages } from '@/lib/supabase/albumImages';
import { isAdmin } from '@/lib/supabase/profiles';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const images = await getAlbumImages(id);
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '앨범 이미지 조회 실패' },
      { status: 500 }
    );
  }
}

export async function POST(
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
    const image = await addAlbumImage({
      albumId: id,
      imageUrl: body.imageUrl,
      title: body.title,
      description: body.description,
      position: body.position,
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '앨범 이미지 추가 실패' },
      { status: 500 }
    );
  }
}

