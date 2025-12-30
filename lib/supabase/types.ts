// Supabase 데이터베이스 타입 정의
// 데이터베이스 스키마 생성 후 자동 생성된 타입으로 업데이트 예정

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          content: string;
          type: 'TECH' | 'TROUBLESHOOTING' | 'PROJECT';
          thumbnail_url: string | null;
          is_published: boolean;
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          content: string;
          type: 'TECH' | 'TROUBLESHOOTING' | 'PROJECT';
          thumbnail_url?: string | null;
          is_published?: boolean;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          content?: string;
          type?: 'TECH' | 'TROUBLESHOOTING' | 'PROJECT';
          thumbnail_url?: string | null;
          is_published?: boolean;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      post_views: {
        Row: {
          id: string;
          post_id: string;
          ip_address: string | null;
          cookie_id: string | null;
          user_id: string | null;
          viewed_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          ip_address?: string | null;
          cookie_id?: string | null;
          user_id?: string | null;
          viewed_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          ip_address?: string | null;
          cookie_id?: string | null;
          user_id?: string | null;
          viewed_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
      };
      post_tags: {
        Row: {
          post_id: string;
          tag_id: string;
        };
        Insert: {
          post_id: string;
          tag_id: string;
        };
        Update: {
          post_id?: string;
          tag_id?: string;
        };
      };
      images: {
        Row: {
          id: string;
          url: string;
          post_id: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          url: string;
          post_id: string;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          url?: string;
          post_id?: string;
          position?: number;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          content: string;
          author_name: string | null;
          author_id: string | null;
          password_hash: string | null;
          ip_address: string | null;
          is_deleted: boolean;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          content: string;
          author_name?: string | null;
          author_id?: string | null;
          password_hash?: string | null;
          ip_address?: string | null;
          is_deleted?: boolean;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          content?: string;
          author_name?: string | null;
          author_id?: string | null;
          password_hash?: string | null;
          ip_address?: string | null;
          is_deleted?: boolean;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          nickname: string | null;
          role: 'user' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          nickname?: string | null;
          role?: 'user' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          nickname?: string | null;
          role?: 'user' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      albums: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          cover_image_url: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          cover_image_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          cover_image_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      album_images: {
        Row: {
          id: string;
          album_id: string;
          image_url: string;
          title: string | null;
          description: string | null;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          album_id: string;
          image_url: string;
          title?: string | null;
          description?: string | null;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          album_id?: string;
          image_url?: string;
          title?: string | null;
          description?: string | null;
          position?: number;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

