// 카테고리 기본 타입 (데이터베이스 스키마)
export interface Category {
  id: string;
  name: string;
  slug: string; // 기존 PostType과 매핑 (TECH, TROUBLESHOOTING, PROJECT)
  description: string | null;
  order: number; // 정렬 순서
  createdAt: string;
  updatedAt: string;
}

// 카테고리 목록 조회 시 사용 (postCount는 조회 시 실시간 COUNT로 계산)
export interface CategoryListItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  postCount: number; // 조회 시 COUNT(posts.id)로 계산
  createdAt: string;
  updatedAt: string;
}

