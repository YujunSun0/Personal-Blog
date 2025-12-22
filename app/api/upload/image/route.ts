import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/supabase/profiles';

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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string | null;

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
    }

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: '이미지 파일만 업로드 가능합니다.' }, { status: 400 });
    }

    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: '파일 크기는 5MB 이하여야 합니다.' }, { status: 400 });
    }

    // 파일명을 URL-safe하게 변환하는 함수
    const sanitizeFileName = (name: string): string => {
      // 확장자 분리
      const lastDotIndex = name.lastIndexOf('.');
      const extension = lastDotIndex !== -1 ? name.slice(lastDotIndex) : '';
      const nameWithoutExt = lastDotIndex !== -1 ? name.slice(0, lastDotIndex) : name;

      // 한글 및 특수 문자를 제거하고 영문, 숫자, 하이픈, 언더스코어만 허용
      // 한글은 제거하고, 특수 문자는 언더스코어로 변환
      const sanitized = nameWithoutExt
        .replace(/[^\w\-_.]/g, '_') // 영문, 숫자, 하이픈, 언더스코어, 점이 아닌 문자를 언더스코어로
        .replace(/_{2,}/g, '_') // 연속된 언더스코어를 하나로
        .replace(/^_+|_+$/g, ''); // 앞뒤 언더스코어 제거

      // 파일명이 비어있으면 기본값 사용
      const finalName = sanitized || 'image';

      return `${finalName}${extension}`;
    };

    // 파일명 생성 (안전하게 변환)
    const timestamp = Date.now();
    const sanitizedFileName = sanitizeFileName(file.name);
    const fileName = folder
      ? `${folder}/${timestamp}-${sanitizedFileName}`
      : `${timestamp}-${sanitizedFileName}`;

    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      // 에러 메시지를 사용자 친화적으로 변환
      let userFriendlyMessage = '이미지 업로드에 실패했습니다.';
      
      if (error.message.includes('Invalid key')) {
        userFriendlyMessage = '파일명에 사용할 수 없는 문자가 포함되어 있습니다. 파일명을 영문, 숫자, 하이픈(-), 언더스코어(_)만 사용하도록 변경해주세요.';
      } else if (error.message.includes('duplicate')) {
        userFriendlyMessage = '같은 이름의 파일이 이미 존재합니다. 잠시 후 다시 시도해주세요.';
      } else if (error.message.includes('size')) {
        userFriendlyMessage = '파일 크기가 너무 큽니다.';
      } else {
        userFriendlyMessage = `이미지 업로드에 실패했습니다: ${error.message}`;
      }

      return NextResponse.json(
        { error: userFriendlyMessage },
        { status: 400 }
      );
    }

    // 공개 URL 생성
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(data.path);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '이미지 업로드 실패' },
      { status: 500 }
    );
  }
}

