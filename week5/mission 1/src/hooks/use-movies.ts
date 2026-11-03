import { useCallback } from 'react'
import { getMovies } from '../api/movies/get-movies'
import { searchMovies } from '../api/movies/search-movies'
import { getMovieDetail } from '../api/movies/get-movie-detail'
import { useApi } from './use-api'
import { toMovie } from '../utils/movies/to-movie'
import { useBookmarkStore } from '../stores/bookmark-store'

export function useMovies(page = 1, query?: string) {
  const load = useCallback((signal: AbortSignal) => query === undefined ? getMovies({ page }, signal) : searchMovies({ query, page }, signal), [page, query])
  const request = useApi(load, query === undefined || Boolean(query))
  const bookmarkedMovieIds = useBookmarkStore((state) => state.bookmarkedMovieIds)
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark)
  const movies = (request.data?.results ?? []).map((movie) => toMovie(movie, bookmarkedMovieIds.includes(movie.id)))

  return { ...request, movies, toggleBookmark, totalPages: Math.min(request.data?.total_pages ?? 0, 500), totalResults: request.data?.total_results ?? 0 }
}

export function useMovieDetail(movieId: string) {
  const load = useCallback((signal: AbortSignal) => getMovieDetail(Number(movieId), signal), [movieId])
  const valid = /^\d+$/.test(movieId) && Number.isSafeInteger(Number(movieId)) && Number(movieId) > 0
  const request = useApi(load, valid)
  const ids = useBookmarkStore((state) => state.bookmarkedMovieIds)
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark)
  return { ...request, movie: request.data ? toMovie(request.data, ids.includes(request.data.id)) : null, toggleBookmark }
}
