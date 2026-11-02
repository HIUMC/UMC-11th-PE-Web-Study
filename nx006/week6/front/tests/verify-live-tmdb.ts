// 수동 검증 전용. 실제 토큰/headers/응답 본문은 출력하거나 저장하지 않는다.
import assert from 'node:assert/strict'
import { loadEnv } from 'vite'
import { createTmdbClient } from '../src/api/tmdb-client.ts'
import { readTmdbEnv } from '../src/config/env.ts'
import { createAppQueryClient } from '../src/config/query-client.ts'
import { movieDetailOptions, movieListOptions, movieSearchOptions } from '../src/queries/movie-queries.ts'
import { toMovieCard, toMovieDetail } from '../src/utils/movies/tmdb-adapter.ts'
import { requestFailure } from '../src/utils/api-request.ts'

const env = readTmdbEnv(loadEnv('development', process.cwd(), 'VITE_'))
const requests: { path: string; status: number }[] = []
const http = createTmdbClient(env, async (input, init) => {
  const response = await fetch(input, init)
  const url = new URL((input as Request).url)
  requests.push({ path: url.pathname + url.search, status: response.status })
  return response
})
const client = createAppQueryClient()
try {
  const first = await client.fetchQuery(movieListOptions(1, http))
  await client.fetchQuery(movieListOptions(2, http))
  const reused = await client.fetchQuery(movieListOptions(1, http))
  assert.equal(first, reused); assert.equal(requests.length, 2)
  console.log(JSON.stringify({ check: 'list 1→2→1', apiRequests: requests.length, cacheReused: true, adapterCards: first.results.map(toMovieCard).length }))
  const search = await client.fetchQuery(movieSearchOptions('  Inception  ', 1, http))
  console.log(JSON.stringify({ check: 'search', page: search.page, resultCount: search.results.length }))
  const detail = toMovieDetail(await client.fetchQuery(movieDetailOptions(27205, http)))
  assert.equal(detail.id, 27205)
  console.log(JSON.stringify({ check: 'detail', id: detail.id, posterPresent: !!detail.posterPath, backdropPresent: !!detail.backdropPath }))
  for (const [kind, url] of [['poster', detail.posterPath], ['backdrop', detail.backdropPath]] as const) {
    if (!url) continue
    const response = await fetch(url, { method: 'HEAD' })
    assert.ok(response.ok && response.headers.get('content-type')?.startsWith('image/'))
    console.log(JSON.stringify({ check: 'image HTTP only', kind, status: response.status, contentType: response.headers.get('content-type') }))
  }
  await assert.rejects(client.fetchQuery(movieDetailOptions(999999999, http)), error => requestFailure(error).status === 404)
  console.log(JSON.stringify({ check: 'missing detail', status: 404 }))
  console.log(JSON.stringify({ check: 'safe request summary', requests }))
} catch (error) {
  console.error(JSON.stringify({ check: 'live verification failed', ...requestFailure(error) }))
  process.exitCode = 1
} finally { client.clear() }
