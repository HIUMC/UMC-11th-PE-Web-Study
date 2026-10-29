// 직접 저장 실습과 persist 복원 경로에서 같은 런타임 검증을 사용한다.
export const PRACTICE_BOOKMARK_KEY = 'umcine-bookmarks'
export const SESSION_PRACTICE_KEY = 'umcine-session-bookmarks'
export type BrowserStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

export function sanitizeBookmarkIds(value: unknown): number[] {
  if (!Array.isArray(value)) return []
  return [...new Set(value.filter((id): id is number => typeof id === 'number' && Number.isSafeInteger(id) && id > 0))]
}

export function readBookmarkIds(storage: BrowserStorage, key = PRACTICE_BOOKMARK_KEY): number[] {
  try {
    const raw = storage.getItem(key)
    return raw === null ? [] : sanitizeBookmarkIds(JSON.parse(raw))
  } catch (error) {
    console.warn(`[UMCine 실습] ${key} 읽기 실패; 빈 배열로 복구합니다.`, error)
    return []
  }
}

export function saveBookmarkIds(storage: BrowserStorage, ids: number[], key = PRACTICE_BOOKMARK_KEY): boolean {
  try { storage.setItem(key, JSON.stringify(sanitizeBookmarkIds(ids))); return true }
  catch (error) { console.warn(`[UMCine 실습] ${key} 저장 실패.`, error); return false }
}
