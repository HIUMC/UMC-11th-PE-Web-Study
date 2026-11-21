import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'
import { loadEnv } from 'vite'
import { MutationObserver, QueryClient, QueryObserver } from '@tanstack/react-query'
import { createMemberClient, readMemberBaseUrl } from '../src/api/api-client.ts'
import { createAuthApi } from '../src/api/auth/auth-api.ts'
import * as api from '../src/api/auth/account-api.ts'
import { memberFailure } from '../src/api/members/member-api.ts'
import { getSession, memberIdFromToken, useAuthStore } from '../src/stores/auth-store.ts'
import { bindAuthLifecycle } from '../src/queries/auth-lifecycle.ts'
import { accountKeys, favoritesOptions, meOptions, ratingsOptions } from '../src/queries/account-queries.ts'
import { favoriteMutationOptions, ratingMutationOptions, updateMeOptions } from '../src/mutations/account-mutations.ts'

// 새 계정을 만들지 않는다. 별도 승인된 전용 실습 계정에서만 실행한다.
export async function verifyLiveAccount(credentials: api.LoginRequest) {
  const values = new Map<string, string>()
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key) } })
  const env = loadEnv('development', process.cwd(), 'VITE_'), base = readMemberBaseUrl(env)
  if (base !== 'https://workbook.devnoco.com/v8/') throw new Error('검증 대상 공식 v8 서버 설정을 확인해 주세요.')
  const requests: { method: string; path: string; status: number }[] = []
  const publicClient = createMemberClient(base, async input => {
    const request = input as Request, response = await fetch(request)
    requests.push({ method: request.method, path: new URL(request.url).pathname, status: response.status })
    return response
  })
  const auth = createAuthApi(publicClient, base)
  const service = {
    ...api,
    getMe: (signal?: AbortSignal) => api.getMe(signal, auth),
    updateMe: (body: { nickname: string }) => api.updateMe(body, auth),
    getFavorites: (signal?: AbortSignal) => api.getFavorites(signal, auth),
    getFavoriteStatus: (id: number, signal?: AbortSignal) => api.getFavoriteStatus(id, signal, auth),
    addFavorite: (id: number) => api.addFavorite(id, auth),
    removeFavorite: (id: number) => api.removeFavorite(id, auth),
    getRatings: (id: number, signal?: AbortSignal) => api.getRatings(id, signal, publicClient),
    addRating: (id: number, body: api.RatingInput) => api.addRating(id, body, auth),
    updateRating: (id: number, body: api.RatingInput) => api.updateRating(id, body, auth),
    removeRating: (id: number) => api.removeRating(id, auth),
  }
  const client = new QueryClient(), unbind = bindAuthLifecycle(client), stops: (() => void)[] = []
  try {
    let failedLogin = false
    try { await api.login({ ...credentials, password: credentials.password + 'wrong' }, publicClient) } catch (error) { failedLogin = memberFailure(error).status === 401 }
    assert.equal(failedLogin, true)
    const login = await api.login(credentials, publicClient)
    useAuthStore.getState().setAccessToken(login.accessToken)
    const session = getSession(), id = memberIdFromToken(login.accessToken)
    assert.ok(id)
    stops.push(new QueryObserver(client, meOptions(session, service)).subscribe(() => {}))
    const me = await client.fetchQuery(meOptions(session, service))
    const getCount = () => requests.filter(x => x.method === 'GET' && x.path.endsWith('/members/me')).length
    const beforeSet = getCount(), setStart = performance.now()
    await new MutationObserver(client, updateMeOptions(client, session, 'set', service)).mutate({ nickname: `s8${Date.now().toString(36)}`.slice(0, 12) })
    const setMs = Math.round(performance.now() - setStart), setGets = getCount() - beforeSet
    assert.equal(setGets, 0)
    const beforeInvalidate = getCount(), invalidateStart = performance.now()
    await new MutationObserver(client, updateMeOptions(client, session, 'invalidate', service)).mutate({ nickname: `i8${Date.now().toString(36)}`.slice(0, 12) })
    const invalidateMs = Math.round(performance.now() - invalidateStart), invalidateGets = getCount() - beforeInvalidate
    assert.equal(invalidateGets, 1)
    await new MutationObserver(client, updateMeOptions(client, session, 'set', service)).mutate({ nickname: me.nickname })
    stops.push(new QueryObserver(client, favoritesOptions(session, service)).subscribe(() => {}))
    const favorites = await client.fetchQuery(favoritesOptions(session, service))
    const movieId = 550
    assert.equal(favorites.some(x => x.movieId === movieId), false, '전용 계정의 테스트 영화는 시작 시 비어 있어야 합니다.')
    const favorite = new MutationObserver(client, favoriteMutationOptions(client, session, movieId, service))
    await favorite.mutate(false)
    assert.equal((await service.getFavoriteStatus(movieId)).isFavorite, true)
    assert.equal(client.getQueryData<api.Favorite[]>(accountKeys.favorites(session.generation))?.some(x => x.movieId === movieId), true)
    await favorite.mutate(true)
    assert.equal((await service.getFavoriteStatus(movieId)).isFavorite, false)
    stops.push(new QueryObserver(client, ratingsOptions(session, true, service)).subscribe(() => {}))
    const ratings = await client.fetchQuery(ratingsOptions(session, true, service))
    assert.equal(ratings.some(x => x.movieId === movieId), false)
    const mutation = new MutationObserver(client, ratingMutationOptions(client, session, movieId, service))
    const created = await mutation.mutate({ kind: 'create', body: { score: 4, comment: 'UMC8 전용 실습' } })
    assert.ok(created)
    await mutation.mutate({ kind: 'update', ratingId: created.ratingId, body: { score: 5, comment: 'UMC8 수정 검증' } })
    assert.equal(client.getQueryData<api.Rating[]>(accountKeys.ratings(session.generation, id))?.find(x => x.ratingId === created.ratingId)?.score, 5)
    await mutation.mutate({ kind: 'delete', ratingId: created.ratingId })
    assert.equal(client.getQueryData<api.Rating[]>(accountKeys.ratings(session.generation, id))?.some(x => x.ratingId === created.ratingId), false)
    const preflight = await fetch(base + 'members/me', { method: 'OPTIONS', headers: { Origin: 'http://localhost:5173', 'Access-Control-Request-Method': 'PATCH', 'Access-Control-Request-Headers': 'authorization,content-type' } })
    assert.ok(preflight.ok)
    const allowOrigin = preflight.headers.get('access-control-allow-origin')
    assert.ok(allowOrigin === '*' || allowOrigin === 'http://localhost:5173')
    useAuthStore.getState().setAccessToken('invalid.jwt.token')
    await assert.rejects(service.getMe())
    assert.equal(useAuthStore.getState().accessToken, null)
    assert.equal(client.getQueryData(accountKeys.me), undefined)
    const summary = { realApi: base, memberId: id, failedLogin: 401, profileGet: 200, setQueryDataExtraGets: setGets, invalidateExtraGets: invalidateGets, setMs, invalidateMs, favorites: 'create/status/list/delete passed', ratings: 'create/update/delete passed', invalidTokenCleared: true, corsPreflight: preflight.status, requests }
    console.log(JSON.stringify(summary))
    return summary
  } finally { stops.forEach(stop => stop()); unbind(); useAuthStore.getState().setAccessToken(null); client.clear() }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const email = process.env.UMC_WEEK8_TEST_EMAIL, password = process.env.UMC_WEEK8_TEST_PASSWORD
  if (!email || !password) { console.error('승인된 실습 계정의 UMC_WEEK8_TEST_EMAIL / UMC_WEEK8_TEST_PASSWORD 환경 변수가 필요합니다.'); process.exitCode = 1 }
  else verifyLiveAccount({ email, password }).catch(error => { console.error(memberFailure(error).message); process.exitCode = 1 })
}
