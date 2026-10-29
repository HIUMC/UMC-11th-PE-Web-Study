import type { KyInstance } from 'ky'
import { getTmdbClient } from '../tmdb-client.ts'
import type { TmdbMovieListResponse } from './models.ts'
import { validateMovieList } from './validate-response.ts'
import { parsePage } from '../../utils/movie-params.ts'
export interface SearchMoviesRequest { query: string; page?: number; signal?: AbortSignal }
export type SearchMoviesResponse = TmdbMovieListResponse
export async function searchMovies({ query, page = 1, signal }: SearchMoviesRequest, client?: KyInstance): Promise<SearchMoviesResponse> {
  const trimmed = query.trim()
  if (!trimmed) return { page: 1, results: [], total_pages: 0, total_results: 0 }
  return validateMovieList(await (client ?? getTmdbClient()).get('search/movie', {
    searchParams: { query: trimmed, language: 'ko-KR', include_adult: false, page: parsePage(page) }, signal,
  }).json<unknown>())
}
