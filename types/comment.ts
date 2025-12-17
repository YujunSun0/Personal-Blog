export interface Comment {
  id: string;
  postId: string;
  content: string; // 최대 2000자
  authorName: string | null; // 비회원의 경우
  authorId: string | null; // 회원의 경우 (회원 탈퇴 시 NULL)
  passwordHash: string | null; // 비회원 댓글 비밀번호 해시
  ipAddress: string | null;
  isDeleted: boolean;
  deletedAt: string | null; // 삭제 시각
  createdAt: string;
  updatedAt: string;
}

export interface CommentListItem {
  id: string;
  postId: string;
  content: string;
  authorName: string | null;
  authorId: string | null;
  createdAt: string;
}

export interface CommentFormData {
  content: string;
  authorName?: string; // 비회원의 경우
  password?: string; // 비회원의 경우
}

