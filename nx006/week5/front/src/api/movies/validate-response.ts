import type { TmdbMovieDetail, TmdbMovieListResponse } from './models.ts'

const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)
const integer = (value: unknown, min: number) => typeof value === 'number' && Number.isSafeInteger(value) && value >= min
function isMovie(value: unknown): value is Record<string, unknown> {
  return record(value) && integer(value.id, 1)
    && ['title', 'original_title', 'overview', 'release_date'].every(key => typeof value[key] === 'string')
    && ['poster_path', 'backdrop_path'].every(key => value[key] === null || (typeof value[key] === 'string' && /^\/[\w./-]+$/.test(value[key])))
    && typeof value.vote_average === 'number' && Number.isFinite(value.vote_average) && integer(value.vote_count, 0)
}
export class TmdbResponseError extends Error {
  constructor() { super('영화 응답 형식이 올바르지 않아요.'); this.name = 'TmdbResponseError' }
}
// adapter와 별개의 런타임 검사. json<T>()의 타입 표기만 신뢰하지 않는다.
export function validateMovieList(value: unknown): TmdbMovieListResponse {
  if (!record(value) || !integer(value.page, 1) || !integer(value.total_pages, 0) || !integer(value.total_results, 0)
    || !Array.isArray(value.results) || !value.results.every(movie => isMovie(movie) && Array.isArray(movie.genre_ids) && movie.genre_ids.every(id => integer(id, 1)))) throw new TmdbResponseError()
  return value as unknown as TmdbMovieListResponse
}
export function validateMovieDetail(value: unknown): TmdbMovieDetail {
  if (!isMovie(value) || typeof value.tagline !== 'string' || !(value.runtime === null || integer(value.runtime, 0))
    || !Array.isArray(value.genres) || !value.genres.every(genre => record(genre) && integer(genre.id, 1) && typeof genre.name === 'string')) throw new TmdbResponseError()
  return value as unknown as TmdbMovieDetail
}
