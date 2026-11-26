import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { BrowserStorage } from '../utils/bookmark-storage.ts'
import { createSafePersistStorage, isRecord, type StorageReporter } from '../utils/safe-persist-storage.ts'

export const AUTH_STORE_KEY = 'umcine-auth-store'
export function normalizeAuth(state: unknown) {
  const value = isRecord(state) ? state.accessToken : undefined
  return { accessToken: typeof value === 'string' && value.length > 0 && value.length <= 16_384 && !/\s/.test(value) ? value : null }
}
interface AuthState { accessToken: string | null; generation: number; setAccessToken: (token: string | null) => void }
export function createAuthStore(storage?: BrowserStorage, report?: StorageReporter) {
  // 인증 정보를 포함할 수 있는 예외 본문은 로그에 출력하지 않는다.
  const safeStorage = createSafePersistStorage(() => storage ?? localStorage, normalizeAuth, report ?? ((message) => console.warn(`[UMCine Auth] ${message}`)))
  return create<AuthState>()(persist(set => ({
    accessToken: null,
    generation: 0,
    setAccessToken: accessToken => set(state => ({ ...normalizeAuth({ accessToken }), generation: state.generation + 1 })),
  }), {
    name: AUTH_STORE_KEY,
    storage: createJSONStorage(() => safeStorage),
    partialize: state => ({ accessToken: state.accessToken }),
    merge: (saved, current) => ({ ...current, ...normalizeAuth(saved) }),
    skipHydration: !storage,
  }))
}
export const useAuthStore = createAuthStore()
export interface AuthSession { accessToken: string | null; generation: number }
export function getSession(): AuthSession {
  const { accessToken, generation } = useAuthStore.getState()
  return { accessToken, generation }
}
export function isCurrentSession(session: AuthSession) {
  const current = getSession()
  return session.generation === current.generation && session.accessToken === current.accessToken
}
export class SessionChangedError extends Error {
  constructor() { super('로그인 상태가 변경됐어요. 다시 시도해 주세요.'); this.name = 'SessionChangedError' }
}
export function assertCurrentSession(session: AuthSession) {
  if (!session.accessToken || !isCurrentSession(session)) throw new SessionChangedError()
}

// 공식 v8에서 가입 memberId와 JWT sub 일치를 실측했다. 디코딩은 서버 인증 검증을 대체하지 않는다.
export function memberIdFromToken(token: string | null): number | null {
  try {
    if (!token || token.split('.').length !== 3) return null
    const payload: unknown = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    if (!isRecord(payload) || typeof payload.sub !== 'string' || !/^[1-9]\d*$/.test(payload.sub)) return null
    const id = Number(payload.sub)
    return Number.isSafeInteger(id) ? id : null
  } catch { return null }
}
