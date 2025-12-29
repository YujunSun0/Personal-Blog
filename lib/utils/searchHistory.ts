const SEARCH_HISTORY_KEY = 'blog_search_history';
const MAX_HISTORY_ITEMS = 10;

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

/**
 * 최근 검색어 목록 가져오기 (최신순, 최대 10개)
 */
export function getSearchHistory(): SearchHistoryItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!stored) return [];
    
    const history: SearchHistoryItem[] = JSON.parse(stored);
    // 최신순으로 정렬하고 최대 10개만 반환
    return history
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, MAX_HISTORY_ITEMS);
  } catch (error) {
    console.error('Failed to get search history:', error);
    return [];
  }
}

/**
 * 검색어 추가 (중복 제거, 최신순 유지)
 */
export function addSearchHistory(query: string): void {
  if (typeof window === 'undefined') return;
  
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return;
  
  try {
    const history = getSearchHistory();
    
    // 중복 제거
    const filteredHistory = history.filter(item => item.query !== trimmedQuery);
    
    // 새 검색어 추가
    const newHistory: SearchHistoryItem[] = [
      { query: trimmedQuery, timestamp: Date.now() },
      ...filteredHistory,
    ].slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Failed to add search history:', error);
  }
}

/**
 * 검색어 삭제
 */
export function removeSearchHistory(query: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const history = getSearchHistory();
    const filteredHistory = history.filter(item => item.query !== query);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(filteredHistory));
  } catch (error) {
    console.error('Failed to remove search history:', error);
  }
}

/**
 * 검색 기록 전체 삭제
 */
export function clearSearchHistory(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear search history:', error);
  }
}

