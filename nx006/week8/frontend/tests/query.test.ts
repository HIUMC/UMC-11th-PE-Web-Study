import assert from 'node:assert/strict'
import { test } from 'node:test'
import { QueryObserver, type QueryClient } from '@tanstack/react-query'
import { createAppQueryClient, retryMovieRequest } from '../src/config/query-client.ts'
import { movieDetailOptions, movieListOptions, movieSearchOptions } from '../src/queries/movie-queries.ts'
import { createTmdbClient } from '../src/api/tmdb-client.ts'
import { TmdbConfigError } from '../src/config/env.ts'
import { TmdbResponseError } from '../src/api/movies/validate-response.ts'
import { fixtureDetail, fixtureList } from './tmdb-fixtures.ts'

const env = { tmdbApiBaseUrl: 'https://api.themoviedb.org/3/', tmdbAccessToken: 'test-only' }
const flush = () => new Promise<void>(resolve => setImmediate(resolve))
function fixtureClient() {
  const requests: URL[] = []
  const http = createTmdbClient(env, async input => {
    const url = new URL((input as Request).url); requests.push(url)
    return Response.json(url.pathname.match(/\/movie\/\d+$/) ? fixtureDetail(Number(url.pathname.split('/').at(-1))) : fixtureList(Number(url.searchParams.get('page') ?? 1), url.searchParams.get('query') ?? ''))
  })
  return { http, requests }
}
function clean(client: QueryClient) { client.clear(); client.unmount() }

test('options 생성은 요청하지 않고 key와 요청은 같은 trim/page/숫자 ID를 사용', async () => {
  const client = createAppQueryClient(), { http, requests } = fixtureClient()
  try {
    const list = movieListOptions(-2, http), search = movieSearchOptions('  영화 & title  ', 2, http), detail = movieDetailOptions(101, http)
    assert.equal(requests.length, 0)
    assert.deepEqual(list.queryKey, ['movies', 'list', { page: 1 }])
    assert.deepEqual(search.queryKey, ['movies', 'search', { query: '영화 & title', page: 2 }])
    assert.deepEqual(detail.queryKey, ['movies', 'detail', 101])
    await client.fetchQuery(list); await client.fetchQuery(search); await client.fetchQuery(detail)
    assert.equal(requests[0]!.searchParams.get('page'), '1')
    assert.equal(requests[1]!.searchParams.get('query'), '영화 & title')
    assert.equal(requests[1]!.searchParams.get('page'), '2')
    assert.equal(requests[2]!.pathname, '/3/movie/101')
    assert.equal(detail.staleTime, 30_000)
    assert.equal(client.getDefaultOptions().queries!.staleTime, 60_000)
    assert.equal(client.getDefaultOptions().queries!.gcTime, 300_000)
  } finally { clean(client) }
})

test('목록 1→2→1은 fresh 페이지 캐시 재사용; 검색어·페이지·영화별로 분리', async () => {
  const client = createAppQueryClient(), { http, requests } = fixtureClient()
  try {
    const first = await client.fetchQuery(movieListOptions(1, http))
    await client.fetchQuery(movieListOptions(2, http))
    assert.equal(await client.fetchQuery(movieListOptions(1, http)), first)
    assert.equal(requests.length, 2)
    for (const [query, page] of [['A', 1], ['B', 1], ['A', 2]] as const) await client.fetchQuery(movieSearchOptions(query, page, http))
    await client.fetchQuery(movieDetailOptions(101, http)); await client.fetchQuery(movieDetailOptions(102, http))
    assert.equal(client.getQueryCache().getAll().length, 7)
    assert.equal(client.getQueryData(movieSearchOptions('A', 1).queryKey)?.results[0]!.title, 'A · 모의 영화 101')
  } finally { clean(client) }
})

test('빈 검색어·무효 ID는 disabled pending/idle, isLoading=false이며 HTTP 요청 없음', async () => {
  const client = createAppQueryClient(), { http, requests } = fixtureClient()
  try {
    const search = new QueryObserver(client, movieSearchOptions('   ', 1, http))
    const detail = new QueryObserver(client, movieDetailOptions(null, http))
    const stopSearch = search.subscribe(() => {}), stopDetail = detail.subscribe(() => {})
    await flush()
    for (const query of [search, detail]) {
      const result = query.getCurrentResult()
      assert.equal(result.isPending, true); assert.equal(result.fetchStatus, 'idle'); assert.equal(result.isLoading, false)
    }
    assert.equal(requests.length, 0)
    await assert.rejects(client.fetchQuery({ ...movieDetailOptions(-1, http), retry: false }), /올바르지 않은/)
    assert.equal(requests.length, 0)
    stopSearch(); stopDetail()
  } finally { clean(client) }
})

test('동일 key의 두 observer는 진행 중인 요청과 성공 캐시를 공유', async () => {
  const client = createAppQueryClient()
  let calls = 0, resolve!: (value: Response) => void
  const http = createTmdbClient(env, () => { calls++; return new Promise<Response>(done => { resolve = done }) })
  const options = movieDetailOptions(101, http)
  const first = new QueryObserver(client, options), second = new QueryObserver(client, options)
  const stopFirst = first.subscribe(() => {}), stopSecond = second.subscribe(() => {})
  try {
    await flush(); assert.equal(calls, 1)
    resolve(Response.json(fixtureDetail())); await flush(); await flush()
    assert.equal(first.getCurrentResult().data, second.getCurrentResult().data)
    assert.equal(first.getCurrentResult().isSuccess, true)
  } finally { stopFirst(); stopSecond(); clean(client) }
})

test('검색 key 변경 시 이전 AbortSignal 취소; 늦은 이전 응답이 최신 결과를 덮지 않음', async () => {
  const client = createAppQueryClient()
  let slowSignal!: AbortSignal, resolveSlow!: (value: Response) => void
  const http = createTmdbClient(env, input => {
    const request = input as Request, url = new URL(request.url)
    if (url.searchParams.get('query') === 'slow') {
      slowSignal = request.signal
      return new Promise<Response>(resolve => { resolveSlow = resolve })
    }
    return Promise.resolve(Response.json(fixtureList(1, 'fast')))
  })
  const observer = new QueryObserver(client, movieSearchOptions('slow', 1, http)), stop = observer.subscribe(() => {})
  try {
    await flush()
    observer.setOptions(movieSearchOptions('fast', 1, http))
    await flush(); await flush()
    assert.equal(slowSignal.aborted, true)
    assert.equal(observer.getCurrentResult().data!.results[0]!.title, 'fast · 모의 영화 101')
    resolveSlow(Response.json(fixtureList(1, 'slow'))); await flush(); await flush()
    assert.equal(observer.getCurrentResult().data!.results[0]!.title, 'fast · 모의 영화 101')
    assert.notEqual(client.getQueryState(movieSearchOptions('slow', 1).queryKey)?.status, 'error')
  } finally { stop(); clean(client) }
})

test('배경 재조회 실패에도 기존 data 보존, refetch로 동일 key 복구', async () => {
  const client = createAppQueryClient()
  let failing = false
  const http = createTmdbClient(env, async () => failing ? Response.json({}, { status: 500 }) : Response.json(fixtureList()))
  const observer = new QueryObserver(client, { ...movieListOptions(1, http), retry: false }), stop = observer.subscribe(() => {})
  try {
    await flush(); await flush()
    const original = observer.getCurrentResult().data
    failing = true
    await observer.refetch()
    assert.equal(observer.getCurrentResult().isError, true)
    assert.equal(observer.getCurrentResult().data, original)
    assert.equal(observer.getCurrentResult().isLoading, false)
    failing = false; await observer.refetch()
    assert.equal(observer.getCurrentResult().isSuccess, true)
    assert.equal(observer.getCurrentResult().isError, false)
  } finally { stop(); clean(client) }
})

test('Query retry는 일시적 실패 1회만, ky retry=0과 중첩되지 않음', async () => {
  const client = createAppQueryClient()
  try {
    for (const [status, expected] of [[500, 2], [429, 2], [401, 1], [403, 1], [404, 1]] as const) {
      let calls = 0
      const http = createTmdbClient(env, async () => { calls++; return Response.json({}, { status }) })
      await assert.rejects(client.fetchQuery({ ...movieDetailOptions(status, http), retryDelay: 0 }))
      assert.equal(calls, expected)
    }
    assert.equal(retryMovieRequest(0, new TmdbConfigError()), false)
    assert.equal(retryMovieRequest(0, new TmdbResponseError()), false)
    assert.equal(retryMovieRequest(0, new DOMException('abort', 'AbortError')), false)
  } finally { clean(client) }
})

test('상세 30초 경과는 stale 전환만; 재방문에서 재조회', async context => {
  context.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: 10_000 })
  const client = createAppQueryClient(), { http, requests } = fixtureClient()
  const options = movieDetailOptions(101, http)
  try {
    await client.fetchQuery(options)
    const cached = client.getQueryCache().find({ queryKey: options.queryKey })!
    context.mock.timers.tick(29_999); assert.equal(cached.isStaleByTime(30_000), false)
    context.mock.timers.tick(2); assert.equal(cached.isStaleByTime(30_000), true)
    assert.equal(requests.length, 1)
    const observer = new QueryObserver(client, options), stop = observer.subscribe(() => {})
    await flush(); await flush()
    assert.equal(requests.length, 2); stop()
  } finally { clean(client); context.mock.timers.reset() }
})

test('gcTime은 active query를 삭제하지 않으며 마지막 observer 제거 후 5분부터 GC', async context => {
  context.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: 10_000 })
  const client = createAppQueryClient(), { http } = fixtureClient(), options = movieListOptions(1, http)
  const observer = new QueryObserver(client, options), stop = observer.subscribe(() => {})
  try {
    await flush(); await flush()
    context.mock.timers.tick(300_001)
    assert.ok(client.getQueryData(options.queryKey))
    stop()
    context.mock.timers.tick(299_999); assert.ok(client.getQueryData(options.queryKey))
    context.mock.timers.tick(2); assert.equal(client.getQueryData(options.queryKey), undefined)
  } finally { clean(client); context.mock.timers.reset() }
})

test('queryOptions로 정리하기 전후 동일 key·함수 의미와 fresh 캐시 공유', async () => {
  const client = createAppQueryClient(), { http, requests } = fixtureClient()
  try {
    const options = movieListOptions(1, http)
    await client.fetchQuery({ queryKey: ['movies', 'list', { page: 1 }], queryFn: options.queryFn })
    await client.fetchQuery(options)
    assert.equal(requests.length, 1)
  } finally { clean(client) }
})
