import type { TagWithCount } from '@/lib/supabase/tags';

// 태그 캐시 설정
const TAGS_CACHE_TTL = 30 * 60 * 1000; // 30분

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// 태그 캐시 상태
let tagsCache: CacheEntry<TagWithCount[]> | null = null;
let isFetchingTags = false; // 동시 요청 방지 플래그
let fetchPromise: Promise<TagWithCount[]> | null = null; // 진행 중인 요청

/**
 * 태그 조회 함수 (캐시 사용, 동시 요청 방지)
 * 
 * @returns 태그 목록
 */
export async function fetchTagsWithCache(): Promise<TagWithCount[]> {
  const now = Date.now();
  
  // 캐시가 있고 유효한 경우 캐시 반환
  if (tagsCache && (now - tagsCache.timestamp) < TAGS_CACHE_TTL) {
    return tagsCache.data;
  }
  
  // 이미 요청 중이면 기존 Promise 반환 (중복 요청 방지)
  if (isFetchingTags && fetchPromise) {
    return fetchPromise;
  }
  
  // 새로운 요청 시작
  isFetchingTags = true;
  fetchPromise = (async () => {
    try {
      const response = await fetch('/api/tags/public');
      const data = await response.json();
      const tags = data || [];
      
      // 캐시 업데이트
      tagsCache = {
        data: tags,
        timestamp: Date.now(),
      };
      
      return tags;
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      // 에러 발생 시 기존 캐시가 있으면 반환, 없으면 빈 배열
      return tagsCache?.data || [];
    } finally {
      isFetchingTags = false;
      fetchPromise = null;
    }
  })();
  
  return fetchPromise;
}

/**
 * 태그 캐시 무효화 (필요시 수동으로 캐시 초기화)
 */
export function invalidateTagsCache(): void {
  tagsCache = null;
  isFetchingTags = false;
  fetchPromise = null;
}

/**
 * 현재 캐시 상태 확인 (디버깅용)
 */
export function getTagsCacheStatus(): {
  hasCache: boolean;
  isExpired: boolean;
  age: number | null;
} {
  if (!tagsCache) {
    return {
      hasCache: false,
      isExpired: true,
      age: null,
    };
  }
  
  const age = Date.now() - tagsCache.timestamp;
  const isExpired = age >= TAGS_CACHE_TTL;
  
  return {
    hasCache: true,
    isExpired,
    age,
  };
}

