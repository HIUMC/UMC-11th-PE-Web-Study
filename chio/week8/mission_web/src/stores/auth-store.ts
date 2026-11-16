import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  setAccessToken: (token: string | null) => void
}

export const useAuthStore = create<AuthState>()(persist(
  (set) => ({ accessToken: null, setAccessToken: (accessToken) => set({ accessToken }) }),
  { name: 'umcine-auth-store', partialize: ({ accessToken }) => ({ accessToken }) },
))

export function getTokenMemberId(token: string | null) {
  if (!token) return undefined
  try {
    // The existing API puts the numeric member ID in the JWT subject.
    const payload = token.split('.')[1].replaceAll('-', '+').replaceAll('_', '/')
    const { sub } = JSON.parse(atob(payload)) as { sub?: unknown }
    if (typeof sub !== 'string' || !/^\d+$/.test(sub)) return undefined
    const memberId = Number(sub)
    return Number.isSafeInteger(memberId) && memberId > 0 ? memberId : undefined
  } catch {
    return undefined
  }
}
