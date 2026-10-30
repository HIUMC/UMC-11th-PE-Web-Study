import type { TmdbMovieListItem, TmdbMovieDetail } from '../../api/movies/models'
import type { Movie } from '../../types/movie'
import { getTmdbPosterUrl, getTmdbBackdropUrl } from './tmdb-image'

export function toMovie(item: TmdbMovieListItem | TmdbMovieDetail, isBookmarked: boolean): Movie {
  const detail = 'genres' in item ? item : undefined
  const minutes = detail?.runtime
  return {
    id: item.id, title: item.title, originalTitle: item.original_title,
    releaseDate: (item.release_date ?? '').replaceAll('-', '.'),
    posterPath: getTmdbPosterUrl(item.poster_path) ?? '/images/movies/placeholder.svg',
    backdropPath: getTmdbBackdropUrl(item.backdrop_path) ?? '/images/movies/placeholder.svg',
    genres: detail?.genres.map((genre) => genre.name) ?? [],
    runtime: minutes ? `${Math.floor(minutes / 60)}시간 ${minutes % 60}분` : '',
    tagline: detail?.tagline || item.title,
    overview: item.overview || '등록된 줄거리가 없어요.', isBookmarked,
  }
}
