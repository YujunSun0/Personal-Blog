export interface Comment {
  id: string;
  postId: string;
  content: string;
  authorName: string | null;
  authorId: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommentWithAuthor extends Comment {
  authorNickname: string | null;
}
