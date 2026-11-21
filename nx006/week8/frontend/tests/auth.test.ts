import assert from 'node:assert/strict'
import test from 'node:test'
import { MutationObserver, QueryClient, QueryObserver } from '@tanstack/react-query'
import { createAuthStore, getSession, memberIdFromToken, SessionChangedError, useAuthStore } from '../src/stores/auth-store.ts'
import { createMemberClient } from '../src/api/api-client.ts'
import { createAuthApi } from '../src/api/auth/auth-api.ts'
import * as api from '../src/api/auth/account-api.ts'
import { MemberResponseError } from '../src/api/members/member-api.ts'
import { accountKeys, favoritesOptions, forSession, meOptions, ratingsOptions } from '../src/queries/account-queries.ts'
import { bindAuthLifecycle } from '../src/queries/auth-lifecycle.ts'
import { favoriteMutationOptions, loginOptions, ratingMutationOptions, signupOptions, updateMeOptions } from '../src/mutations/account-mutations.ts'

const token = (id: string) => `e30.${Buffer.from(JSON.stringify({ sub: id })).toString('base64url')}.synthetic`
const member = { email: 'test@example.com', nickname: '영화팬', createdAt: '2026-11-22T00:00:00Z' }
const favorite = { favoriteId: 8, movieId: 550, createdAt: member.createdAt }
const rating = { ratingId: 91, movieId: 550, score: 4, comment: '실습', createdAt: member.createdAt, updatedAt: member.createdAt }
const json = (result: unknown, status = 200) => new Response(JSON.stringify({ isSuccess: true, code: 'COMMON200', result }), { status, headers: { 'Content-Type': 'application/json' } })
const deferred = <T,>() => { let resolve!: (value: T) => void; let reject!: (reason: unknown) => void; const promise = new Promise<T>((a, b) => { resolve = a; reject = b }); return { promise, resolve, reject } }
const memory = () => { const map = new Map<string, string>(); return { getItem: (key: string) => map.get(key) ?? null, setItem: (key: string, value: string) => { map.set(key, value) }, removeItem: (key: string) => { map.delete(key) } } }

Object.defineProperty(globalThis, 'localStorage', { value: memory(), configurable: true })

test('auth persist는 토큰만 복원하고 손상/주입 상태를 정리한다', () => {
  const storage = memory(), report = () => {}
  const a = createAuthStore(storage, report)
  a.getState().setAccessToken(token('19'))
  assert.deepEqual(Object.keys(JSON.parse(storage.getItem('umcine-auth-store')!).state), ['accessToken'])
  const b = createAuthStore(storage, report)
  assert.equal(b.getState().accessToken, token('19'))
  for (const value of ['{broken', '{"state":{"accessToken":12}}', '{"state":{"accessToken":"bad token","nickname":"fake"}}']) {
    storage.setItem('umcine-auth-store', value)
    assert.equal(createAuthStore(storage, report).getState().accessToken, null)
  }
  assert.equal(memberIdFromToken(token('19')), 19)
  for (const id of ['0', '-1', '1.5', '9007199254740992', 'x']) assert.equal(memberIdFromToken(token(id)), null)
  assert.equal(memberIdFromToken('broken'), null)
})

test('authApi는 최신 토큰을 요청 직전에 읽고 다른 origin에는 보내지 않는다', async () => {
  let current = { accessToken: token('1'), generation: 1 }
  const headers: (string | null)[] = []
  const client = createMemberClient('https://example.com/v8', async request => { headers.push((request as Request).headers.get('Authorization')); return json(member) })
  const auth = createAuthApi(client, 'https://example.com/v8/', () => current, () => {})
  await api.getMe(undefined, auth)
  current = { accessToken: token('2'), generation: 2 }
  await api.getMe(undefined, auth)
  assert.deepEqual(headers, [`Bearer ${token('1')}`, `Bearer ${token('2')}`])
  await assert.rejects(auth.get('https://api.themoviedb.org/3/movie/1'))
  assert.equal(headers.length, 2)
})

test('401만 인증 해제하며 이전 세션의 늦은 401은 새 로그인에 영향이 없다', async () => {
  let current = { accessToken: token('1'), generation: 1 }, cleared = 0
  for (const status of [403, 500, 401]) {
    const client = createMemberClient('https://example.com/v8', async () => json(null, status))
    const auth = createAuthApi(client, 'https://example.com/v8/', () => current, () => { cleared++ })
    await assert.rejects(api.getMe(undefined, auth))
    assert.equal(cleared, status === 401 ? 1 : 0)
  }
  const pending = deferred<Response>(), started = deferred<void>()
  const client = createMemberClient('https://example.com/v8', async () => { started.resolve(); return pending.promise })
  const auth = createAuthApi(client, 'https://example.com/v8/', () => current, () => { cleared++ })
  const request = api.getMe(undefined, auth)
  await started.promise
  current = { accessToken: token('2'), generation: 2 }
  pending.resolve(json(null, 401))
  await assert.rejects(request)
  assert.equal(cleared, 1)
})

test('공식 API body/ID/envelope와 ratings raw array를 구분한다', async () => {
  const seen: { path: string; method: string; body: unknown }[] = []
  const client = createMemberClient('https://example.com/v8', async request => {
    const req = request as Request, path = new URL(req.url).pathname
    seen.push({ path, method: req.method, body: req.method === 'POST' || req.method === 'PATCH' ? await req.json() : null })
    if (path.endsWith('/auth/login')) return json({ nickname: '영화팬', accessToken: token('19') })
    if (path.includes('/ratings') && req.method === 'GET') return new Response(JSON.stringify([rating]), { headers: { 'Content-Type': 'application/json' } })
    if (path.includes('/ratings')) return json(req.method === 'DELETE' ? null : rating)
    if (path.endsWith('/favorites/550') && req.method === 'GET') return json({ isFavorite: true })
    if (path.includes('/favorites')) return json(req.method === 'DELETE' ? null : req.method === 'GET' ? [favorite] : favorite)
    return json(member)
  })
  assert.equal((await api.login({ email: ' test@example.com ', password: 'test-only' }, client)).nickname, '영화팬')
  assert.deepEqual(await api.getMe(undefined, client), member)
  await api.updateMe({ nickname: ' 새닉네임 ' }, client)
  assert.deepEqual(await api.getFavorites(undefined, client), [favorite])
  assert.equal((await api.getFavoriteStatus(550, undefined, client)).isFavorite, true)
  await api.addFavorite(550, client); await api.removeFavorite(550, client)
  assert.deepEqual(await api.getRatings(19, undefined, client), [rating])
  await api.addRating(550, { score: 4, comment: '실습' }, client)
  await api.updateRating(91, { score: 5, comment: '' }, client)
  await api.removeRating(91, client)
  assert.deepEqual(seen.find(x => x.path.endsWith('/ratings') && x.method === 'POST')?.body, { movieId: 550, score: 4, comment: '실습' })
  assert.ok(seen.some(x => x.path.endsWith('/ratings/91') && x.method === 'PATCH'))
  assert.ok(seen.some(x => x.path.endsWith('/favorites/550') && x.method === 'DELETE'))
  assert.deepEqual(seen.find(x => x.path.endsWith('/members/me') && x.method === 'PATCH')?.body, { nickname: '새닉네임' })
  const invalid = createMemberClient('https://example.com/v8', async () => json({ isFavorite: 'true' }))
  await assert.rejects(api.getFavoriteStatus(550, undefined, invalid), MemberResponseError)
  await assert.rejects(api.getRatings(19, undefined, invalid), MemberResponseError)
})

test('로그아웃/전환은 사용자 캐시·진행 중 요청을 제거하고 영화 캐시는 유지한다', async () => {
  useAuthStore.getState().setAccessToken(token('1'))
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const stop = bindAuthLifecycle(client)
  const pending = deferred<typeof member>(), started = deferred<void>()
  const service = { ...api, getMe: async () => { started.resolve(); return pending.promise } }
  client.setQueryData(['movies', 'list', { page: 1 }], ['movie'])
  client.setQueryData(['favorites', 1, 'list'], [favorite])
  const request = client.fetchQuery(meOptions(getSession(), service))
  await started.promise
  const rejected = assert.rejects(request)
  useAuthStore.getState().setAccessToken(token('2'))
  pending.resolve(member)
  await rejected
  assert.equal(client.getQueryData(accountKeys.me), undefined)
  assert.equal(client.getQueryData(['favorites', 1, 'list']), undefined)
  assert.deepEqual(client.getQueryData(['movies', 'list', { page: 1 }]), ['movie'])
  stop(); client.clear(); useAuthStore.getState().setAccessToken(null)
})

test('취소를 무시한 늦은 성공/실패는 session 검사에서 거부한다', async () => {
  for (const succeed of [true, false]) {
    useAuthStore.getState().setAccessToken(token('1'))
    const pending = deferred<number>()
    const work = forSession(getSession(), () => pending.promise)
    useAuthStore.getState().setAccessToken(token('2'))
    if (succeed) pending.resolve(1); else pending.reject(new Error('old network'))
    await assert.rejects(work, SessionChangedError)
  }
  useAuthStore.getState().setAccessToken(null)
})

test('내 정보 query는 disabled idle, 5분 stale/retry false; 조건별 사용자 key 분리', () => {
  const session = getSession(), client = new QueryClient()
  const observer = new QueryObserver(client, meOptions(session))
  const result = observer.getCurrentResult()
  assert.equal(result.fetchStatus, 'idle'); assert.equal(result.isLoading, false)
  assert.equal(meOptions(session).staleTime, 300_000); assert.equal(meOptions(session).retry, false)
  assert.notDeepEqual(favoritesOptions({ ...session, generation: 1 }).queryKey, favoritesOptions({ ...session, generation: 2 }).queryKey)
  assert.equal(ratingsOptions(session, false).enabled, false)
  client.clear()
})

test('동일한 수정: setQueryData는 GET0회, invalidate는 활성 query GET1회 후 반영', async () => {
  useAuthStore.getState().setAccessToken(token('19'))
  const session = getSession(), client = new QueryClient()
  let server = { ...member }, gets = 0
  const service = { ...api, getMe: async () => { gets++; return { ...server } }, updateMe: async (body: { nickname: string }) => { server = { ...server, nickname: body.nickname }; return { ...server } } }
  const observer = new QueryObserver(client, meOptions(session, service)), stop = observer.subscribe(() => {})
  await client.fetchQuery(meOptions(session, service))
  const baseline = gets
  await new MutationObserver(client, updateMeOptions(client, session, 'set', service)).mutate({ nickname: '직접갱신' })
  assert.equal(gets - baseline, 0)
  assert.equal(client.getQueryData<typeof member>(accountKeys.me)?.nickname, '직접갱신')
  await new MutationObserver(client, updateMeOptions(client, session, 'invalidate', service)).mutate({ nickname: '재조회' })
  assert.equal(gets - baseline, 1)
  assert.equal(client.getQueryData<typeof member>(accountKeys.me)?.nickname, '재조회')
  stop(); client.clear(); useAuthStore.getState().setAccessToken(null)
})

test('favorite/rating mutationOptions는 성공 이후 관련 목록만 무효화한다', async () => {
  useAuthStore.getState().setAccessToken(token('19'))
  const session = getSession(), client = new QueryClient()
  const fKey = accountKeys.favorites(session.generation), rKey = accountKeys.ratings(session.generation, 19)
  client.setQueryData(fKey, []); client.setQueryData(rKey, []); client.setQueryData(accountKeys.me, member)
  client.setQueryData(['movies', 'list', { page: 1 }], ['movie'])
  const service = { ...api, addFavorite: async () => favorite, removeFavorite: async () => null, addRating: async () => rating, updateRating: async () => rating, removeRating: async () => null }
  const f = new MutationObserver(client, favoriteMutationOptions(client, session, 550, service))
  await f.mutate(false)
  assert.deepEqual(client.getQueryData(accountKeys.favorite(session.generation, 550)), { isFavorite: true })
  assert.equal(client.getQueryState(fKey)?.isInvalidated, true)
  await f.mutate(true)
  assert.deepEqual(client.getQueryData(accountKeys.favorite(session.generation, 550)), { isFavorite: false })
  const r = new MutationObserver(client, ratingMutationOptions(client, session, 550, service))
  await r.mutate({ kind: 'create', body: { score: 4 } })
  await r.mutate({ kind: 'update', ratingId: 91, body: { score: 5 } })
  await r.mutate({ kind: 'delete', ratingId: 91 })
  assert.equal(client.getQueryState(rKey)?.isInvalidated, true)
  assert.equal(client.getQueryState(accountKeys.me)?.isInvalidated, false)
  assert.equal(client.getQueryState(['movies', 'list', { page: 1 }])?.isInvalidated, false)
  client.clear(); useAuthStore.getState().setAccessToken(null)
})

test('mutationFn은 두 번째 context를 HTTP client로 받지 않고 실패를 reject한다', async () => {
  const client = new QueryClient()
  let args = 0
  const options = signupOptions(async (...values) => { args = values.length; throw new Error('expected') })
  const observer = new MutationObserver(client, options)
  await assert.rejects(observer.mutate({ email: 'test@example.com', nickname: '영화팬', password: 'test-only' }))
  assert.equal(args, 1); assert.equal(observer.getCurrentResult().isError, true)
  const login = new MutationObserver(client, loginOptions(client, { ...api, login: async () => { throw new Error('expected') } }))
  await assert.rejects(login.mutate({ email: 'test@example.com', password: 'test-only' }))
  assert.equal(login.getCurrentResult().isError, true)
  client.clear()
})
