import { type TmdbEnv } from '../../config/env.ts'
import type { TmdbMovieListResponse } from './models.ts'
import { validateMovieList } from './validate-response.ts'
import { parsePage } from '../../utils/movie-params.ts'
export type GetMoviesWithFetchResponse = TmdbMovieListResponse
export class FetchHttpError extends Error {
  readonly status: number
  constructor(status: number) { super(`영화 목록 요청에 실패했어요: ${status}`); this.status = status }
}
export async function getMoviesWithFetch(page = 1, signal?: AbortSignal, config?: TmdbEnv): Promise<GetMoviesWithFetchResponse> {
  const baseUrl = config?.tmdbApiBaseUrl ?? new URL('/api/tmdb/', window.location.origin).href
  const url = new URL('movie/popular', baseUrl.replace(/\/+$/, '') + '/')
  url.search = new URLSearchParams({ language: 'ko-KR', page: String(parsePage(page)) }).toString()
  const response = await fetch(url, { headers: config ? { Authorization: `Bearer ${config.tmdbAccessToken}` } : undefined, signal })
  if (!response.ok) throw new FetchHttpError(response.status)
  return validateMovieList(await response.json())
}
