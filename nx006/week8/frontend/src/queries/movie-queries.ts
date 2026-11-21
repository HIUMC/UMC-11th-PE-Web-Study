import { queryOptions } from '@tanstack/react-query'
import type { KyInstance } from 'ky'
import { getMovies } from '../api/movies/get-movies.ts'
import { searchMovies } from '../api/movies/search-movies.ts'
import { getMovieDetail } from '../api/movies/get-movie-detail.ts'
import { parsePage } from '../utils/movie-params.ts'

export const movieKeys = {
  list: (page: number) => ['movies', 'list', { page }] as const,
  search: (query: string, page: number) => ['movies', 'search', { query, page }] as const,
  detail: (movieId: number | null) => ['movies', 'detail', movieId] as const,
}

// client 주입은 기존 HTTP 함수와 같은 테스트 경계다. 실제 앱은 기본 TMDB 인스턴스를 사용한다.
export function movieListOptions(page = 1, client?: KyInstance) {
  const normalizedPage = parsePage(page)
  return queryOptions({
    queryKey: movieKeys.list(normalizedPage),
    queryFn: ({ signal }) => getMovies({ page: normalizedPage, signal }, client),
  })
}

export function movieSearchOptions(query: string, page = 1, client?: KyInstance) {
  const normalizedQuery = query.trim(), normalizedPage = parsePage(page)
  return queryOptions({
    queryKey: movieKeys.search(normalizedQuery, normalizedPage),
    queryFn: ({ signal }) => searchMovies({ query: normalizedQuery, page: normalizedPage, signal }, client),
    enabled: normalizedQuery.length > 0,
  })
}

export function movieDetailOptions(movieId: number | null, client?: KyInstance) {
  const id = movieId !== null && Number.isSafeInteger(movieId) && movieId > 0 ? movieId : null
  return queryOptions({
    queryKey: movieKeys.detail(id),
    queryFn: ({ signal }) => {
      if (id === null) throw new Error('올바르지 않은 영화 번호예요.')
      return getMovieDetail(id, signal, client)
    },
    enabled: id !== null,
    staleTime: 30_000,
  })
}
