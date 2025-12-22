import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getCommentsByPostId,
  createCommentAsUser,
  createCommentAsGuest,
} from '@/lib/supabase/comments';
import { isAdmin } from '@/lib/supabase/profiles';

// 댓글 목록 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'postId가 필요합니다.' }, { status: 400 });
    }

    const comments = await getCommentsByPostId(postId);
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '댓글 조회 실패' },
      { status: 500 }
    );
  }
}

// 댓글 작성
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = await request.json();
    const { postId, content, authorName, password } = body;

    if (!postId || !content) {
      return NextResponse.json(
        { error: 'postId와 content가 필요합니다.' },
        { status: 400 }
      );
    }

    // 내용 길이 검증
    if (content.length > 2000) {
      return NextResponse.json(
        { error: '댓글은 2000자 이하여야 합니다.' },
        { status: 400 }
      );
    }

    let comment;

    if (user) {
      // 회원 댓글 작성
      comment = await createCommentAsUser(postId, content, user.id);
    } else {
      // 비회원 댓글 작성
      if (!authorName || !password) {
        return NextResponse.json(
          { error: '비회원은 이름과 비밀번호가 필요합니다.' },
          { status: 400 }
        );
      }

      // IP 주소 가져오기
      const ipAddress =
        request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'unknown';

      comment = await createCommentAsGuest(postId, content, authorName, password, ipAddress);
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '댓글 작성 실패' },
      { status: 500 }
    );
  }
}

