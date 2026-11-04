import { queryOptions } from '@tanstack/react-query'
import { getMovies } from '../api/movies/get-movies'
import { searchMovies } from '../api/movies/search-movies'
import { getMovieDetail } from '../api/movies/get-movie-detail'

export const movieQueries = {
  popular: (page: number) => queryOptions({
    queryKey: ['movies', 'popular', page],
    queryFn: ({ signal }) => getMovies({ page }, signal),
  }),
  search: (query: string, page: number) => queryOptions({
    queryKey: ['movies', 'search', query, page],
    queryFn: ({ signal }) => searchMovies({ query, page }, signal),
    enabled: query.length > 0,
  }),
  detail: (movieId: number) => queryOptions({
    queryKey: ['movies', 'detail', movieId],
    queryFn: ({ signal }) => getMovieDetail(movieId, signal),
    enabled: Number.isSafeInteger(movieId) && movieId > 0,
  }),
}
