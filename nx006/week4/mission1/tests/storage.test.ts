import assert from 'node:assert/strict'
import { test, mock } from 'node:test'
import { createBookmarkStore, BOOKMARK_STORE_KEY } from '../src/stores/bookmark-store.ts'
import { createDisplaySettingsStore, DISPLAY_SETTINGS_KEY } from '../src/stores/display-settings-store.ts'
import { readBookmarkIds, saveBookmarkIds, sanitizeBookmarkIds, type BrowserStorage } from '../src/utils/bookmark-storage.ts'

function memoryStorage(initial?: string): BrowserStorage {
  const values = new Map<string, string>(initial === undefined ? [] : [[BOOKMARK_STORE_KEY, initial]])
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value) }, removeItem: key => { values.delete(key) } }
}
const ignoreReport = () => {}

test('직접 저장: stringify/parse, missing key, removeItem은 다른 key를 보존', () => {
  const storage = memoryStorage()
  assert.deepEqual(readBookmarkIds(storage), [])
  assert.equal(saveBookmarkIds(storage, [2, 7]), true)
  assert.equal(storage.getItem('umcine-bookmarks'), '[2,7]')
  assert.deepEqual(readBookmarkIds(storage), [2, 7])
  storage.setItem('other', 'keep')
  storage.removeItem('umcine-bookmarks')
  assert.deepEqual(readBookmarkIds(storage), [])
  assert.equal(storage.getItem('other'), 'keep')
})
test('양의 안전한 정수만 남기고 중복 제거; 오래된 정상 ID는 허용', () => {
  assert.deepEqual(sanitizeBookmarkIds([2, 2, 7, '1', null, 0, -1, 1.5, Infinity, Number.MAX_SAFE_INTEGER + 1, 999]), [2, 7, 999])
})
test('직접 저장: 잘못된 JSON/비배열은 빈 배열', () => {
  const warning = mock.method(console, 'warn', () => {})
  try {
    const storage = memoryStorage()
    for (const value of ['broken', '{}', 'null', '7']) { storage.setItem('umcine-bookmarks', value); assert.deepEqual(readBookmarkIds(storage), []) }
    assert.ok(warning.mock.callCount() > 0)
  } finally { warning.mock.restore() }
})
test('추가/제거는 중복 없이 동작하며 action은 직렬화하지 않음', () => {
  const storage = memoryStorage()
  const store = createBookmarkStore(storage, ignoreReport)
  assert.deepEqual(store.getState().bookmarkedMovieIds, [])
  store.getState().toggleBookmark(2); store.getState().toggleBookmark(7)
  assert.deepEqual(store.getState().bookmarkedMovieIds, [2, 7])
  assert.deepEqual(JSON.parse(storage.getItem(BOOKMARK_STORE_KEY)!), { state: { bookmarkedMovieIds: [2, 7] }, version: 0 })
  store.getState().toggleBookmark(2); store.getState().toggleBookmark(2)
  assert.deepEqual(store.getState().bookmarkedMovieIds, [7, 2])
  store.getState().toggleBookmark(2); store.getState().toggleBookmark(7)
  assert.deepEqual(store.getState().bookmarkedMovieIds, [])
  for (const invalid of [0, -1, NaN, Infinity, 1.5]) store.getState().toggleBookmark(invalid)
  assert.deepEqual(store.getState().bookmarkedMovieIds, [])
})
test('새 인스턴스에서 재수화; key 삭제는 열린 메모리 대신 다음 복원부터 반영', () => {
  const storage = memoryStorage()
  const first = createBookmarkStore(storage, ignoreReport)
  first.getState().toggleBookmark(2)
  assert.deepEqual(createBookmarkStore(storage, ignoreReport).getState().bookmarkedMovieIds, [2])
  storage.removeItem(BOOKMARK_STORE_KEY)
  assert.deepEqual(first.getState().bookmarkedMovieIds, [2])
  assert.deepEqual(createBookmarkStore(storage, ignoreReport).getState().bookmarkedMovieIds, [])
})
for (const raw of ['broken', 'null', '[]', '{}', '{"state":null}', '{"state":{"bookmarkedMovieIds":{}}}', '{"state":{"bookmarkedMovieIds":[2]},"version":99}']) {
  test(`손상된 persist 복원 후 정상 저장 가능: ${raw}`, () => {
    const storage = memoryStorage(raw)
    const reports: string[] = []
    const store = createBookmarkStore(storage, message => reports.push(message))
    assert.deepEqual(store.getState().bookmarkedMovieIds, [])
    assert.ok(reports.length > 0)
    store.getState().toggleBookmark(7)
    assert.deepEqual(createBookmarkStore(storage, ignoreReport).getState().bookmarkedMovieIds, [7])
  })
}
test('혼합 ID와 action 주입 정리; 데이터에 없는 정상 ID도 복원 가능', () => {
  const storage = memoryStorage(JSON.stringify({ state: { bookmarkedMovieIds: [2, 2, 7, '3', null, -1, 0, 1.5, 999], toggleBookmark: 'injected' }, version: 0 }))
  const store = createBookmarkStore(storage, ignoreReport)
  assert.deepEqual(store.getState().bookmarkedMovieIds, [2, 7, 999])
  assert.equal(typeof store.getState().toggleBookmark, 'function')
  assert.deepEqual(JSON.parse(storage.getItem(BOOKMARK_STORE_KEY)!).state, { bookmarkedMovieIds: [2, 7, 999] })
})
test('차단된 저장소 및 용량 오류는 보고하고 메모리 동작 유지', () => {
  const reports: string[] = []
  const storage: BrowserStorage = { getItem() { throw new Error('SecurityError') }, setItem() { throw new Error('QuotaExceededError') }, removeItem() { throw new Error('SecurityError') } }
  const store = createBookmarkStore(storage, message => reports.push(message))
  store.getState().toggleBookmark(2)
  assert.deepEqual(store.getState().bookmarkedMovieIds, [2])
  store.persist.clearStorage()
  assert.equal(reports.length, 3)
})
test('화면 설정은 기본값·허용값 검증 및 북마크와 별도 저장', () => {
  const storage = memoryStorage()
  const settings = createDisplaySettingsStore(storage, ignoreReport)
  const bookmarks = createBookmarkStore(storage, ignoreReport)
  assert.equal(settings.getState().cardSize, 'standard')
  settings.getState().setCardSize('compact'); bookmarks.getState().toggleBookmark(2)
  assert.equal(createDisplaySettingsStore(storage, ignoreReport).getState().cardSize, 'compact')
  assert.deepEqual(createBookmarkStore(storage, ignoreReport).getState().bookmarkedMovieIds, [2])
  storage.setItem(DISPLAY_SETTINGS_KEY, '{"state":{"cardSize":"huge"},"version":0}')
  assert.equal(createDisplaySettingsStore(storage, ignoreReport).getState().cardSize, 'standard')
  storage.setItem(DISPLAY_SETTINGS_KEY, 'broken')
  assert.equal(createDisplaySettingsStore(storage, ignoreReport).getState().cardSize, 'standard')
})
