import type { KyInstance } from 'ky'
import { getMemberClient, readMemberBaseUrl } from '../api-client.ts'
import { getSession, isCurrentSession, SessionChangedError, useAuthStore, type AuthSession } from '../../stores/auth-store.ts'

export function createAuthApi(client: KyInstance, baseUrl: string, readSession = getSession, unauthorized = (session: AuthSession) => {
  if (isCurrentSession(session)) useAuthStore.getState().setAccessToken(null)
}) {
  const base = new URL(baseUrl)
  const sessions = new WeakMap<Request, AuthSession>()
  return client.extend({ hooks: {
    beforeRequest: [({ request }) => {
      const url = new URL(request.url)
      // 절대 URL을 잘못 넘겨도 서비스 토큰을 외부/TMDB에 보내지 않는다.
      if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) throw new Error('회원 API 주소가 올바르지 않아요.')
      const session = readSession()
      if (!session.accessToken) throw new SessionChangedError()
      sessions.set(request, session)
      request.headers.set('Authorization', `Bearer ${session.accessToken}`)
    }],
    afterResponse: [({ request, response }) => {
      const session = sessions.get(request)
      const current = readSession()
      // 이전 계정 요청의 늦은 401로 새 로그인까지 해제하지 않는다.
      if (response.status === 401 && session && session.generation === current.generation && session.accessToken === current.accessToken) unauthorized(session)
    }],
  } })
}
let client: KyInstance | undefined
export function getAuthApi() {
  return client ??= createAuthApi(getMemberClient(), readMemberBaseUrl(import.meta.env ?? {}))
}
