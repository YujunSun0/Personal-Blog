// 태그 기본 타입 (데이터베이스 스키마)
export interface Tag {
  id: string;
  name: string;
}

// 태그 목록 조회 시 사용 (postCount는 조회 시 실시간 COUNT로 계산)
export interface TagListItem {
  id: string;
  name: string;
  postCount: number; // 조회 시 COUNT(post_tags.post_id)로 계산
}

