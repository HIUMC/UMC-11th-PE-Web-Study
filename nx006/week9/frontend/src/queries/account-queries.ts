import { queryOptions } from '@tanstack/react-query'
import * as accountApi from '../api/auth/account-api.ts'
import { assertCurrentSession, getSession, memberIdFromToken, type AuthSession } from '../stores/auth-store.ts'

export const accountKeys = {
  me: ['members', 'me'] as const,
  favorites: (generation: number) => ['favorites', generation, 'list'] as const,
  favorite: (generation: number, movieId: number) => ['favorites', generation, 'status', movieId] as const,
  ratings: (generation: number, memberId: number | null) => ['ratings', generation, memberId] as const,
}
export async function forSession<T>(session: AuthSession, work: () => Promise<T>): Promise<T> {
  assertCurrentSession(session)
  try {
    const data = await work()
    assertCurrentSession(session)
    return data
  } catch (error) {
    assertCurrentSession(session)
    throw error
  }
}
export function meOptions(session = getSession(), api = accountApi) {
  return queryOptions({ queryKey: accountKeys.me, queryFn: ({ signal }) => forSession(session, () => api.getMe(signal)), enabled: Boolean(session.accessToken), staleTime: 300_000, retry: false, meta: { private: true } })
}
export function favoritesOptions(session = getSession(), api = accountApi) {
  return queryOptions({ queryKey: accountKeys.favorites(session.generation), queryFn: ({ signal }) => forSession(session, () => api.getFavorites(signal)), enabled: Boolean(session.accessToken), staleTime: 60_000, retry: false, meta: { private: true } })
}
export function favoriteOptions(movieId: number, session = getSession(), enabled = true, api = accountApi) {
  return queryOptions({ queryKey: accountKeys.favorite(session.generation, movieId), queryFn: ({ signal }) => forSession(session, () => api.getFavoriteStatus(movieId, signal)), enabled: Boolean(session.accessToken) && enabled, retry: false, meta: { private: true } })
}
export function ratingsOptions(session = getSession(), verified = false, api = accountApi) {
  const memberId = memberIdFromToken(session.accessToken)
  return queryOptions({ queryKey: accountKeys.ratings(session.generation, memberId), queryFn: ({ signal }) => forSession(session, () => {
    if (memberId === null) throw new Error('현재 회원 번호를 확인할 수 없어요.')
    return api.getRatings(memberId, signal)
  }), enabled: Boolean(session.accessToken) && memberId !== null && verified, retry: false, meta: { private: true } })
}
