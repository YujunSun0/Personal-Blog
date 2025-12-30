/**
 * 문자열이 비어있거나 공백만 있는지 확인
 * @param value - 확인할 문자열
 * @returns 비어있거나 공백만 있으면 true
 */
export function isBlank(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}

/**
 * 문자열을 trim하고, 비어있으면 null 반환
 * @param value - 처리할 문자열
 * @returns trim된 문자열 또는 null
 */
export function trimOrNull(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

/**
 * 문자열을 trim하고, 비어있으면 빈 문자열 반환
 * @param value - 처리할 문자열
 * @returns trim된 문자열 또는 빈 문자열
 */
export function trimOrEmpty(value: string | null | undefined): string {
  return value?.trim() || '';
}

