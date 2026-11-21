import type { KyInstance } from 'ky'
import { getTmdbClient } from '../tmdb-client.ts'
import type { TmdbMovieDetail } from './models.ts'
import { validateMovieDetail } from './validate-response.ts'
export type GetMovieDetailResponse = TmdbMovieDetail
export async function getMovieDetail(movieId: number, signal?: AbortSignal, client?: KyInstance): Promise<GetMovieDetailResponse> {
  if (!Number.isSafeInteger(movieId) || movieId < 1) throw new Error('올바르지 않은 영화 번호예요.')
  return validateMovieDetail(await (client ?? getTmdbClient()).get(`movie/${movieId}`, {
    searchParams: { language: 'ko-KR' }, signal,
  }).json<unknown>())
}
