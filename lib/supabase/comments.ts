import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';
import type { Comment, CommentWithAuthor } from '@/types/comment';
import bcrypt from 'bcryptjs';

type CommentRow = Database['public']['Tables']['comments']['Row'];
type CommentInsert = Database['public']['Tables']['comments']['Insert'];
type CommentUpdate = Database['public']['Tables']['comments']['Update'];

/**
 * 데이터베이스 Row를 Comment 타입으로 변환
 */
function mapCommentRowToComment(row: CommentRow): Comment {
  return {
    id: row.id,
    postId: row.post_id,
    content: row.content,
    authorName: row.author_name,
    authorId: row.author_id,
    isDeleted: row.is_deleted,
    deletedAt: row.deleted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * 댓글 목록 조회 (글 ID로)
 */
export async function getCommentsByPostId(postId: string): Promise<CommentWithAuthor[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`댓글 조회 실패: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  const comments = data as unknown as CommentRow[];

  // 회원 댓글의 프로필 정보 일괄 조회
  // nickname은 공개 정보이므로 RLS 정책에서 허용되어야 함
  const userIds = comments
    .map((row) => row.author_id)
    .filter((id): id is string => id !== null);

  let profilesMap: Record<string, string | null> = {};

  if (userIds.length > 0) {
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('user_id, nickname')
      .in('user_id', userIds);

    if (profileError) {
      console.error('프로필 조회 실패:', profileError);
      // 프로필 조회 실패해도 댓글은 반환
    } else if (profiles) {
      const profileRows = profiles as unknown as Array<{ user_id: string; nickname: string | null }>;
      profilesMap = profileRows.reduce((acc, profile) => {
        acc[profile.user_id] = profile.nickname;
        return acc;
      }, {} as Record<string, string | null>);
    }
  }

  // 댓글과 프로필 정보 결합
  const commentsWithAuthor: CommentWithAuthor[] = comments.map((row) => {
    const comment = mapCommentRowToComment(row);
    const authorNickname = row.author_id ? profilesMap[row.author_id] || null : null;

    return {
      ...comment,
      authorNickname,
    };
  });

  return commentsWithAuthor;
}

/**
 * 댓글 생성 (회원)
 */
export async function createCommentAsUser(
  postId: string,
  content: string,
  userId: string
): Promise<CommentWithAuthor> {
  const supabase = await createClient();

  const insertData: CommentInsert = {
    post_id: postId,
    content,
    author_id: userId,
    author_name: null,
    password_hash: null,
  };

  const { data, error } = await (supabase
    .from('comments') as unknown as {
      insert: (values: CommentInsert) => {
        select: () => {
          single: () => Promise<{ data: CommentRow | null; error: { message: string } | null }>;
        };
      };
    })
    .insert(insertData)
    .select()
    .single();

  if (error) {
    throw new Error(`댓글 작성 실패: ${error.message}`);
  }

  if (!data) {
    throw new Error('댓글 작성 실패: 데이터가 없습니다.');
  }

  const comment = mapCommentRowToComment(data);

  // 프로필에서 nickname 조회
  let authorNickname: string | null = null;
  if (userId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('nickname')
      .eq('user_id', userId)
      .single();

    if (profile) {
      const profileRow = profile as unknown as { nickname: string | null };
      authorNickname = profileRow.nickname;
    }
  }

  return {
    ...comment,
    authorNickname,
  };
}

/**
 * 댓글 생성 (비회원)
 */
export async function createCommentAsGuest(
  postId: string,
  content: string,
  authorName: string,
  password: string,
  ipAddress: string
): Promise<CommentWithAuthor> {
  const supabase = await createClient();

  // 비밀번호 해시화
  const passwordHash = await bcrypt.hash(password, 10);

  const insertData: CommentInsert = {
    post_id: postId,
    content,
    author_name: authorName,
    author_id: null,
    password_hash: passwordHash,
    ip_address: ipAddress,
  };

  const { data, error } = await (supabase
    .from('comments') as unknown as {
      insert: (values: CommentInsert) => {
        select: () => {
          single: () => Promise<{ data: CommentRow | null; error: { message: string } | null }>;
        };
      };
    })
    .insert(insertData)
    .select()
    .single();

  if (error) {
    throw new Error(`댓글 작성 실패: ${error.message}`);
  }

  if (!data) {
    throw new Error('댓글 작성 실패: 데이터가 없습니다.');
  }

  const comment = mapCommentRowToComment(data);

  return {
    ...comment,
    authorNickname: null, // 비회원은 nickname이 없음
  };
}

/**
 * 비밀번호 검증
 */
export async function verifyCommentPassword(
  commentId: string,
  password: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('comments')
    .select('password_hash')
    .eq('id', commentId)
    .single();

  if (error || !data) {
    return false;
  }

  const row = data as unknown as Pick<CommentRow, 'password_hash'>;
  if (!row.password_hash) {
    return false;
  }

  return bcrypt.compare(password, row.password_hash);
}

/**
 * 댓글 수정
 */
export async function updateComment(
  commentId: string,
  content: string,
  userId?: string
): Promise<Comment> {
  // RLS 정책 우회를 위해 서비스 역할 사용
  // 권한 확인은 애플리케이션 레벨에서 수행
  const { createServiceRoleClient } = await import('./server');
  const supabase = createServiceRoleClient();

  // 권한 확인 (회원 댓글 수정 시)
  if (userId) {
    const { data: comment } = await supabase
      .from('comments')
      .select('author_id')
      .eq('id', commentId)
      .single();

    const commentRow = comment as unknown as Pick<CommentRow, 'author_id'> | null;
    if (!commentRow || commentRow.author_id !== userId) {
      throw new Error('댓글 수정 권한이 없습니다.');
    }
  }

  const updateData: CommentUpdate = { content };

  const { data, error } = await (supabase
    .from('comments') as unknown as {
      update: (values: CommentUpdate) => {
        eq: (column: string, value: string) => {
          select: () => {
            single: () => Promise<{ data: CommentRow | null; error: { message: string } | null }>;
          };
        };
      };
    })
    .update(updateData)
    .eq('id', commentId)
    .select()
    .single();

  if (error) {
    throw new Error(`댓글 수정 실패: ${error.message}`);
  }

  if (!data) {
    throw new Error('댓글 수정 실패: 데이터가 없습니다.');
  }

  return mapCommentRowToComment(data);
}

/**
 * 댓글 삭제 (소프트 삭제)
 */
export async function deleteComment(
  commentId: string,
  userId?: string,
  isAdmin: boolean = false
): Promise<void> {
  // RLS 정책 우회를 위해 서비스 역할 사용
  // 권한 확인은 애플리케이션 레벨에서 수행
  const { createServiceRoleClient } = await import('./server');
  const supabase = createServiceRoleClient();

  // 권한 확인 (회원 댓글 삭제 시)
  if (!isAdmin && userId) {
    const { data: comment } = await supabase
      .from('comments')
      .select('author_id')
      .eq('id', commentId)
      .single();

    const commentRow = comment as unknown as Pick<CommentRow, 'author_id'> | null;
    if (!commentRow || commentRow.author_id !== userId) {
      throw new Error('댓글 삭제 권한이 없습니다.');
    }
  }

  const updateData: CommentUpdate = {
    is_deleted: true,
    deleted_at: new Date().toISOString(),
  };

  const { error } = await (supabase
    .from('comments') as unknown as {
      update: (values: CommentUpdate) => {
        eq: (column: string, value: string) => Promise<{ error: { message: string } | null }>;
      };
    })
    .update(updateData)
    .eq('id', commentId);

  if (error) {
    throw new Error(`댓글 삭제 실패: ${error.message}`);
  }
}

