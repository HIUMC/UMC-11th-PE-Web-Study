import assert from 'node:assert/strict'
import { test, mock } from 'node:test'
import { createTmdbClient } from '../src/api/tmdb-client.ts'
import { readTmdbEnv, TmdbConfigError } from '../src/config/env.ts'
import { getMovies } from '../src/api/movies/get-movies.ts'
import { searchMovies } from '../src/api/movies/search-movies.ts'
import { getMovieDetail } from '../src/api/movies/get-movie-detail.ts'
import { getMoviesWithFetch, FetchHttpError } from '../src/api/movies/get-movies-with-fetch.ts'
import { validateMovieDetail, validateMovieList } from '../src/api/movies/validate-response.ts'
import { fixtureDetail, fixtureList, fixtureMovie } from './tmdb-fixtures.ts'
import { formatRuntime, toMovieCard, toMovieDetail } from '../src/utils/movies/tmdb-adapter.ts'
import { tmdbImage } from '../src/utils/movies/tmdb-image.ts'
import { parseMovieId, parsePage, moviePageCount } from '../src/utils/movie-params.ts'
import { paginationPages } from '../src/utils/pagination-pages.ts'
import { requestFailure, runApiRequest, type RequestState } from '../src/utils/api-request.ts'
import { promiseStatusPractice, loadWithThen, loadWithAsyncAwait } from '../src/examples/promise-practice.ts'

const env = { tmdbApiBaseUrl: 'https://api.themoviedb.org/3/', tmdbAccessToken: 'test-only-not-a-real-token' }
const flush = () => new Promise<void>(resolve => setImmediate(resolve))

test('환경 변수 누락은 안전한 안내; base URL 끝 slash 정규화, 토큰 미출력', () => {
  assert.throws(() => readTmdbEnv({}), TmdbConfigError)
  const normalized = readTmdbEnv({ VITE_TMDB_API_BASE_URL: 'https://api.themoviedb.org/3', VITE_TMDB_ACCESS_TOKEN: 'test-only' })
  assert.equal(normalized.tmdbApiBaseUrl, env.tmdbApiBaseUrl)
  assert.throws(() => readTmdbEnv({ VITE_TMDB_API_BASE_URL: 'not-a-url', VITE_TMDB_ACCESS_TOKEN: 'test-only' }), TmdbConfigError)
})
test('ky 목록·검색·상세의 실제 Request URL, query, Bearer header와 DTO 형태', async () => {
  const requests: Request[] = []
  const client = createTmdbClient(env, async input => {
    const request = input as Request; requests.push(request)
    return Response.json(new URL(request.url).pathname.endsWith('/101') ? fixtureDetail() : fixtureList())
  })
  await getMovies({ page: 2 }, client)
  await searchMovies({ query: '  영화 & title  ', page: 3 }, client)
  await getMovieDetail(101, undefined, client)
  const [list, search, detail] = requests.map(request => new URL(request.url))
  assert.equal(list!.pathname, '/3/movie/popular')
  assert.equal(list!.searchParams.get('language'), 'ko-KR')
  assert.equal(list!.searchParams.get('page'), '2')
  assert.equal(search!.pathname, '/3/search/movie')
  assert.equal(search!.searchParams.get('query'), '영화 & title')
  assert.equal(search!.searchParams.get('include_adult'), 'false')
  assert.equal(search!.searchParams.get('page'), '3')
  assert.equal(detail!.pathname, '/3/movie/101')
  assert.equal(detail!.searchParams.get('language'), 'ko-KR')
  assert.ok(requests.every(request => request.headers.get('Authorization') === `Bearer ${env.tmdbAccessToken}`))
})
test('빈 검색어·잘못된 영화 ID는 fetch를 호출하지 않음', async () => {
  let calls = 0
  const client = createTmdbClient(env, async () => { calls++; return Response.json(fixtureList()) })
  assert.equal((await searchMovies({ query: '   ' }, client)).results.length, 0)
  for (const id of [0, -1, NaN, Infinity, 1.5, Number.MAX_SAFE_INTEGER + 1]) await assert.rejects(getMovieDetail(id, undefined, client))
  assert.equal(calls, 0)
})
test('HTTP 404/401/500 처리 및 ky 자동 재시도 비활성화', async () => {
  for (const status of [404, 401, 500]) {
    let calls = 0
    const client = createTmdbClient(env, async () => { calls++; return Response.json({ status_message: 'fixture failure' }, { status }) })
    try { await getMovieDetail(101, undefined, client); assert.fail('Expected failure') }
    catch (error) { assert.equal(requestFailure(error).status, status) }
    assert.equal(calls, 1)
  }
})
test('순수 fetch의 URL/query/HTTP 오류 및 JSON 복원', async () => {
  const calls: { url: URL; init?: RequestInit }[] = []
  const fetchMock = mock.method(globalThis, 'fetch', async (input: URL | string, init?: RequestInit) => {
    calls.push({ url: new URL(input), init })
    return Response.json(fixtureList(2))
  })
  try {
    assert.equal((await getMoviesWithFetch(2, undefined, env)).page, 2)
    assert.equal(calls[0]!.url.pathname, '/3/movie/popular')
    assert.equal(calls[0]!.url.searchParams.get('page'), '2')
    assert.equal(calls[0]!.url.searchParams.get('language'), 'ko-KR')
    assert.equal(new Headers(calls[0]!.init?.headers).get('Authorization'), `Bearer ${env.tmdbAccessToken}`)
    fetchMock.mock.mockImplementation(async () => Response.json({}, { status: 500 }))
    await assert.rejects(getMoviesWithFetch(1, undefined, env), error => error instanceof FetchHttpError && error.status === 500)
  } finally { fetchMock.mock.restore() }
})
test('adapter의 DTO/UI 분리, 날짜/이미지/누락 값과 상세 runtime 변환', () => {
  const card = toMovieCard({ ...fixtureMovie, poster_path: '/poster.jpg' })
  assert.equal(card.posterPath, 'https://image.tmdb.org/t/p/w500/poster.jpg')
  assert.equal(card.releaseDate, '2026.01.02')
  assert.equal('genre_ids' in card, false)
  assert.equal('isBookmarked' in card, false)
  const detail = toMovieDetail({ ...fixtureDetail(), backdrop_path: '/backdrop.jpg' })
  assert.equal(detail.backdropPath, 'https://image.tmdb.org/t/p/w1280/backdrop.jpg')
  assert.deepEqual(detail.genres, ['드라마'])
  assert.equal(detail.runtime, '2시간 5분')
  assert.equal(tmdbImage(null, 'w500'), null)
  const missing = toMovieDetail({ ...fixtureDetail(), title: '', original_title: '', overview: '', release_date: '', tagline: '', runtime: null })
  assert.equal(missing.posterPath, null)
  assert.equal(missing.backdropPath, null)
  assert.equal(missing.releaseDate, '개봉일 정보 없음')
  assert.equal(missing.title, '제목 정보 없음')
  for (const [minutes, label] of [[null, '상영 시간 정보 없음'], [0, '상영 시간 정보 없음'], [45, '45분'], [120, '2시간']] as const) assert.equal(formatRuntime(minutes), label)
})
test('런타임 validator는 손상 응답을 거부하고 null 이미지/runtime은 허용', () => {
  assert.equal(validateMovieDetail(fixtureDetail(102)).runtime, null)
  assert.equal(validateMovieList(fixtureList()).results[0]!.poster_path, null)
  for (const value of [null, {}, { ...fixtureList(), results: {} }, { ...fixtureList(), results: [{ ...fixtureMovie, id: '101' }] }]) assert.throws(() => validateMovieList(value))
  for (const value of [{ ...fixtureDetail(), runtime: '125' }, { ...fixtureDetail(), genres: null }, { ...fixtureDetail(), poster_path: 'javascript:invalid' }]) assert.throws(() => validateMovieDetail(value))
})
test('URL page/ID 검증과 많은 페이지에서 5개 버튼만 표시', () => {
  for (const value of [undefined, 0, -1, 1.5, Infinity, '2x', '1e2', 501, {}, []]) assert.equal(parsePage(value), 1)
  assert.equal(parsePage('2'), 2)
  assert.equal(parsePage(500), 500)
  for (const value of ['0', '-1', 'abc', '2.5', '1e2', '9007199254740992']) assert.equal(parseMovieId(value), null)
  assert.equal(parseMovieId('101'), 101)
  assert.equal(moviePageCount(999), 500)
  assert.deepEqual(paginationPages(250, 500), [248, 249, 250, 251, 252])
  assert.deepEqual(paginationPages(500, 500), [496, 497, 498, 499, 500])
})
test('응답 역전: 취소를 무시하는 이전 성공/실패가 최신 상태를 덮어쓰지 않음', async () => {
  const states: RequestState<string>[] = []
  let resolveOld!: (value: string) => void
  const cancelOld = runApiRequest(() => new Promise<string>(resolve => { resolveOld = resolve }), state => states.push(state))
  await flush(); cancelOld()
  runApiRequest(async () => 'new', state => states.push(state))
  await flush(); resolveOld('old'); await flush()
  assert.deepEqual(states.at(-1), { status: 'success', data: 'new' })
  let rejectOld!: (error: Error) => void
  const cancelFailure = runApiRequest(() => new Promise<string>((_, reject) => { rejectOld = reject }), state => states.push(state))
  await flush(); cancelFailure()
  runApiRequest(async () => 'newer', state => states.push(state))
  await flush(); rejectOld(new Error('old failure')); await flush()
  assert.deepEqual(states.at(-1), { status: 'success', data: 'newer' })
})
test('cleanup은 abort하고 취소를 오류로 표시하지 않음; 실패 후 같은 요청 재실행', async () => {
  let signal!: AbortSignal
  const states: RequestState<string>[] = []
  const cancel = runApiRequest(input => { signal = input; return new Promise((_, reject) => input.addEventListener('abort', () => reject(new DOMException('cancel', 'AbortError')))) }, state => states.push(state))
  await flush(); cancel(); await flush()
  assert.equal(signal.aborted, true)
  assert.equal(states.some(state => state.status === 'error'), false)
  let calls = 0
  const request = async () => { if (++calls === 1) throw new Error('fixture failure'); return 'restored' }
  runApiRequest(request, state => states.push(state)); await flush()
  assert.equal(states.at(-1)!.status, 'error')
  runApiRequest(request, state => states.push(state)); await flush()
  assert.deepEqual(states.at(-1), { status: 'success', data: 'restored' })
})
test('Promise pending/fulfilled/rejected/finally와 두 문법의 성공/실패 실습', async () => {
  const messages: string[] = []
  await promiseStatusPractice(value => messages.push(value))
  await promiseStatusPractice(value => messages.push(value), true)
  assert.deepEqual(messages, ['pending', 'fulfilled', 'finally', 'pending', 'rejected', 'finally'])
  for (const load of [loadWithThen, loadWithAsyncAwait]) {
    assert.equal(await load(async () => 'movie'), 'movie')
    let reported = false
    await assert.rejects(load(async () => { throw new Error('practice') }, () => { reported = true }))
    assert.equal(reported, true)
  }
})
