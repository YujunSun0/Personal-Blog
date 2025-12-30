import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';
import type { Database } from '@/lib/supabase/types';
import type { SupabaseClient } from '@supabase/supabase-js';

type PostUpdate = Database['public']['Tables']['posts']['Update'];
type PostViewsInsert = Database['public']['Tables']['post_views']['Insert'];
type PostRow = Database['public']['Tables']['posts']['Row'];
type PostViewsRow = Database['public']['Tables']['post_views']['Row'];

/**
 * 조회수 증가 API
 * 쿠키 + IP 기반 중복 방지 (24시간)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const supabase = await createClient();

    // 글 존재 확인
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('id, is_published')
      .eq('id', postId)
      .single();

    if (postError || !post) {
      return NextResponse.json(
        { error: '글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 공개된 글만 조회수 증가
    const postData = post as Pick<PostRow, 'id' | 'is_published'>;
    if (!postData.is_published) {
      return NextResponse.json(
        { error: '공개되지 않은 글입니다.' },
        { status: 403 }
      );
    }

    // 쿠키 확인
    const cookieStore = await cookies();
    const cookieName = `viewed_post_${postId}`;
    const existingCookie = cookieStore.get(cookieName);

    // 쿠키가 있으면 중복 조회 (24시간 내)
    if (existingCookie) {
      return NextResponse.json(
        { message: '이미 조회한 글입니다.', viewCount: null },
        { status: 200 }
      );
    }

    // IP 주소 가져오기
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // 쿠키 ID 생성 (없으면 새로 생성)
    let cookieId = cookieStore.get('view_cookie_id')?.value;
    if (!cookieId) {
      cookieId = randomUUID();
    }

    // 로그인 사용자 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id || null;

    // 중복 체크 (쿠키 ID 또는 사용자 ID로)
    // 24시간 내 조회 기록 확인
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    // 쿠키 ID로 먼저 확인
    const { data: existingViewByCookie } = await supabase
      .from('post_views')
      .select('id')
      .eq('post_id', postId)
      .eq('cookie_id', cookieId)
      .gte('viewed_at', twentyFourHoursAgo)
      .maybeSingle();

    // 로그인 사용자인 경우 사용자 ID로도 확인
    let existingViewByUser = null;
    if (userId) {
      const { data } = await supabase
        .from('post_views')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .gte('viewed_at', twentyFourHoursAgo)
        .maybeSingle();
      existingViewByUser = data;
    }

    const existingView = existingViewByCookie || existingViewByUser;

    if (existingView) {
      // 중복이지만 쿠키가 없었던 경우 쿠키 설정
      const response = NextResponse.json(
        { message: '이미 조회한 글입니다.', viewCount: null },
        { status: 200 }
      );
      response.cookies.set(cookieName, '1', {
        maxAge: 24 * 60 * 60, // 24시간
        httpOnly: false,
        sameSite: 'lax',
      });
      if (!cookieStore.get('view_cookie_id')) {
        response.cookies.set('view_cookie_id', cookieId, {
          maxAge: 365 * 24 * 60 * 60, // 1년
          httpOnly: false,
          sameSite: 'lax',
        });
      }
      return response;
    }

    // 조회 기록 저장
    const viewData: PostViewsInsert = {
      post_id: postId,
      ip_address: ipAddress,
      cookie_id: cookieId,
      user_id: userId,
    };
    const supabaseWithTypes = supabase as SupabaseClient<Database>;
    const { error: viewError } = await (supabaseWithTypes
      .from('post_views') as unknown as {
        insert: (values: PostViewsInsert) => Promise<{ error: { code?: string; message: string } | null }>;
      })
      .insert(viewData);

    if (viewError) {
      // UNIQUE 제약 위반 (동시 요청 등)
      if (viewError.code === '23505') {
        return NextResponse.json(
          { message: '이미 조회한 글입니다.', viewCount: null },
          { status: 200 }
        );
      }
      throw viewError;
    }

    // 조회수 증가 (현재 값 조회 후 +1 업데이트)
    const { data: currentPost, error: fetchError } = await supabaseWithTypes
      .from('posts')
      .select('view_count')
      .eq('id', postId)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    const currentPostData = currentPost as Pick<PostRow, 'view_count'> | null;
    const currentViewCount = currentPostData?.view_count ?? 0;
    const newViewCount = currentViewCount + 1;

    const updateData: PostUpdate = {
      view_count: newViewCount,
    };
    
    // 업데이트 실행 (select 없이)
    const { error: updateError } = await (supabaseWithTypes
      .from('posts') as unknown as {
        update: (values: PostUpdate) => {
          eq: (column: string, value: string) => Promise<{
            error: { message: string; code?: string } | null;
          }>;
        };
      })
      .update(updateData)
      .eq('id', postId);

    if (updateError) {
      throw updateError;
    }

    // 쿠키 설정 (24시간 유지)
    const response = NextResponse.json(
      {
        message: '조회수가 증가했습니다.',
        viewCount: newViewCount,
      },
      { status: 200 }
    );

    response.cookies.set(cookieName, '1', {
      maxAge: 24 * 60 * 60, // 24시간
      httpOnly: false,
      sameSite: 'lax',
    });

    // 쿠키 ID가 없으면 설정
    if (!cookieStore.get('view_cookie_id')) {
      response.cookies.set('view_cookie_id', cookieId, {
        maxAge: 365 * 24 * 60 * 60, // 1년
        httpOnly: false,
        sameSite: 'lax',
      });
    }

    return response;
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return NextResponse.json(
      {
        error: '조회수 증가에 실패했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

