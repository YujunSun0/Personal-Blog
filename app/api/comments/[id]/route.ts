import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateComment, deleteComment, verifyCommentPassword } from '@/lib/supabase/comments';
import { isAdmin } from '@/lib/supabase/profiles';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// 댓글 수정
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { id } = await params;
    const body = await request.json();
    const { content, password } = body;

    if (!content) {
      return NextResponse.json({ error: 'content가 필요합니다.' }, { status: 400 });
    }

    // 내용 길이 검증
    if (content.length > 2000) {
      return NextResponse.json(
        { error: '댓글은 2000자 이하여야 합니다.' },
        { status: 400 }
      );
    }

    if (user) {
      // 회원 댓글 수정
      const comment = await updateComment(id, content, user.id);
      return NextResponse.json(comment);
    } else {
      // 비회원 댓글 수정 (비밀번호 검증 필요)
      if (!password) {
        return NextResponse.json(
          { error: '비밀번호가 필요합니다.' },
          { status: 400 }
        );
      }

      const isValid = await verifyCommentPassword(id, password);
      if (!isValid) {
        return NextResponse.json(
          { error: '비밀번호가 일치하지 않습니다.' },
          { status: 401 }
        );
      }

      const comment = await updateComment(id, content);
      return NextResponse.json(comment);
    }
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '댓글 수정 실패' },
      { status: 500 }
    );
  }
}

// 댓글 삭제
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { id } = await params;
    const body = await request.json();
    const { password } = body;

    let userId: string | undefined;
    let adminCheck = false;

    if (user) {
      userId = user.id;
      adminCheck = await isAdmin(user.id);
    } else {
      // 비회원 댓글 삭제 (비밀번호 검증 필요)
      if (!password) {
        return NextResponse.json(
          { error: '비밀번호가 필요합니다.' },
          { status: 400 }
        );
      }

      const isValid = await verifyCommentPassword(id, password);
      if (!isValid) {
        return NextResponse.json(
          { error: '비밀번호가 일치하지 않습니다.' },
          { status: 401 }
        );
      }
    }

    await deleteComment(id, userId, adminCheck);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '댓글 삭제 실패' },
      { status: 500 }
    );
  }
}

