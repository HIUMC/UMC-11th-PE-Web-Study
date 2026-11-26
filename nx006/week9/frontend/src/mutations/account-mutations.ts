import { mutationOptions, type QueryClient } from '@tanstack/react-query'
import * as api from '../api/auth/account-api.ts'
import { signup, type SignupRequest } from '../api/members/member-api.ts'
import { getSession, isCurrentSession, memberIdFromToken, SessionChangedError, useAuthStore, type AuthSession } from '../stores/auth-store.ts'
import { accountKeys, forSession } from '../queries/account-queries.ts'
import { clearPrivateCache } from '../queries/auth-lifecycle.ts'

export const signupOptions = (request = signup) => mutationOptions({ mutationKey: ['signup'], mutationFn: (body: SignupRequest) => request(body), retry: false, gcTime: 0 })
export function loginOptions(client: QueryClient, service = api) {
  return mutationOptions({ mutationKey: ['login'], retry: false, gcTime: 0,
    mutationFn: async (body: api.LoginRequest) => {
      const session = getSession()
      const data = await service.login(body)
      if (!isCurrentSession(session)) throw new SessionChangedError()
      return data
    },
    onSuccess: async result => {
      clearPrivateCache(client)
      useAuthStore.getState().setAccessToken(result.accessToken)
      await client.invalidateQueries({ queryKey: accountKeys.me })
    },
  })
}
// mode는 같은 수정 흐름의 실습/자동 검증용. 실제 화면은 성공 응답을 setQueryData로 반영한다.
export function updateMeOptions(client: QueryClient, session: AuthSession, mode: 'set' | 'invalidate' = 'set', service = api) {
  return mutationOptions({ mutationKey: ['members', 'update', session.generation], retry: false, gcTime: 0,
    mutationFn: (body: { nickname: string }) => forSession(session, () => service.updateMe(body)),
    onSuccess: async member => {
      if (!isCurrentSession(session)) return
      if (mode === 'set') client.setQueryData(accountKeys.me, member)
      else await client.invalidateQueries({ queryKey: accountKeys.me })
    },
  })
}
export function favoriteMutationOptions(client: QueryClient, session: AuthSession, movieId: number, service = api) {
  return mutationOptions({ mutationKey: ['favorites', 'write', session.generation, movieId], retry: false, gcTime: 0,
    mutationFn: (remove: boolean) => forSession(session, () => remove ? service.removeFavorite(movieId) : service.addFavorite(movieId)),
    onSuccess: async (result) => {
      if (!isCurrentSession(session)) return
      client.setQueryData(accountKeys.favorite(session.generation, movieId), { isFavorite: result !== null })
      await client.invalidateQueries({ queryKey: accountKeys.favorites(session.generation) })
    },
    onError: async () => {
      if (!isCurrentSession(session)) return
      await Promise.all([
        client.invalidateQueries({ queryKey: accountKeys.favorites(session.generation) }),
        client.invalidateQueries({ queryKey: accountKeys.favorite(session.generation, movieId) }),
      ])
    },
  })
}
export type RatingAction = { kind: 'create'; body: api.RatingInput } | { kind: 'update'; ratingId: number; body: api.RatingInput } | { kind: 'delete'; ratingId: number }
export function ratingMutationOptions(client: QueryClient, session: AuthSession, movieId: number, service = api) {
  const key = accountKeys.ratings(session.generation, memberIdFromToken(session.accessToken))
  return mutationOptions({ mutationKey: ['ratings', 'write', session.generation, movieId], retry: false, gcTime: 0,
    mutationFn: (action: RatingAction) => forSession(session, () => action.kind === 'create' ? service.addRating(movieId, action.body) : action.kind === 'update' ? service.updateRating(action.ratingId, action.body) : service.removeRating(action.ratingId)),
    onSuccess: async () => { if (isCurrentSession(session)) await client.invalidateQueries({ queryKey: key }) },
    // 다른 탭에서 수정/삭제한 경우도 새 목록으로 복구한다.
    onError: async () => { if (isCurrentSession(session)) await client.invalidateQueries({ queryKey: key }) },
  })
}
