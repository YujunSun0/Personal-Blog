export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  userId: string;
  nickname: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

