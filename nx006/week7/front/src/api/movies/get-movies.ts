import type { KyInstance } from 'ky'
import { getTmdbClient } from '../tmdb-client.ts'
import type { TmdbMovieListResponse } from './models.ts'
import { validateMovieList } from './validate-response.ts'
import { parsePage } from '../../utils/movie-params.ts'
export interface GetMoviesRequest { page?: number; signal?: AbortSignal }
export type GetMoviesResponse = TmdbMovieListResponse
export async function getMovies({ page = 1, signal }: GetMoviesRequest = {}, client?: KyInstance): Promise<GetMoviesResponse> {
  return validateMovieList(await (client ?? getTmdbClient()).get('movie/popular', {
    searchParams: { language: 'ko-KR', page: parsePage(page) }, signal,
  }).json<unknown>())
}
