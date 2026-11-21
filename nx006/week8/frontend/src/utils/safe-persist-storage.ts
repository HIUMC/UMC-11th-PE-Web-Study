import type { StateStorage } from 'zustand/middleware'
import type { BrowserStorage } from './bookmark-storage.ts'

export type StorageReporter = (message: string, error?: unknown) => void
export const reportStorageIssue: StorageReporter = (message, error) => console.warn(`[UMCine Storage] ${message}`, error ?? '')
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// createJSONStorage가 JSON.parse하기 전에 손상된 envelope를 복구한다.
// 읽기/쓰기 권한이나 용량 오류는 보고하고 메모리 상태의 사용은 허용한다.
export function createSafePersistStorage(
  getStorage: () => BrowserStorage,
  normalize: (state: unknown) => object,
  report: StorageReporter = reportStorageIssue,
): StateStorage {
  return {
    getItem(name) {
      let storage: BrowserStorage
      let raw: string | null
      try { storage = getStorage(); raw = storage.getItem(name) }
      catch (error) { report(`${name} 읽기 실패. 저장값을 복원하지 못했습니다.`, error); return null }
      if (raw === null) return null
      let state: unknown
      let original: unknown
      try {
        original = JSON.parse(raw)
        if (!isRecord(original) || !isRecord(original.state) || (original.version !== undefined && original.version !== 0)) throw new Error('예상한 persist state/version 형태가 아닙니다.')
        state = original.state
      } catch (error) { report(`${name} JSON/형식 오류. 기본값으로 복구합니다.`, error) }
      const normalized = JSON.stringify({ state: normalize(state), version: 0 })
      if (JSON.stringify(original) !== normalized) {
        report(`${name} 저장값을 허용된 데이터로 정리했습니다.`)
        try { storage.setItem(name, normalized) }
        catch (error) { report(`${name} 복구값 저장 실패. 현재 화면은 복구 상태를 사용합니다.`, error) }
      }
      return normalized
    },
    setItem(name, value) {
      try { getStorage().setItem(name, value) }
      catch (error) { report(`${name} 저장 실패. 변경은 현재 메모리에만 유지됩니다.`, error) }
    },
    removeItem(name) {
      try { getStorage().removeItem(name) }
      catch (error) { report(`${name} 삭제 실패.`, error) }
    },
  }
}
