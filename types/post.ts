export type PostType = 'TECH' | 'TROUBLESHOOTING' | 'PROJECT';

export interface Post {
  id: string;
  title: string;
  description: string | null;
  content: string; // Markdown
  type: PostType;
  thumbnailUrl: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostListItem {
  id: string;
  title: string;
  description: string | null;
  type: PostType;
  thumbnailUrl: string | null;
  createdAt: string;
  tags?: Array<{
    id: string;
    name: string;
  }>;
}

export interface PostWithTags extends Post {
  tags: Array<{
    id: string;
    name: string;
  }>;
}

