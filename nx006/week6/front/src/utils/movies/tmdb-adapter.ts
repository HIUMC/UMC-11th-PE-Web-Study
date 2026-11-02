import type { TmdbMovie, TmdbMovieDetail, TmdbMovieListItem } from '../../api/movies/models.ts'
import type { Movie, MovieCardData } from '../../types/movie.ts'
import { tmdbImage } from './tmdb-image.ts'
function common(movie: TmdbMovie): MovieCardData {
  return {
    id: movie.id,
    title: movie.title || movie.original_title || '제목 정보 없음',
    originalTitle: movie.original_title || '원제 정보 없음',
    releaseDate: movie.release_date ? movie.release_date.replaceAll('-', '.') : '개봉일 정보 없음',
    posterPath: tmdbImage(movie.poster_path, 'w500'),
    overview: movie.overview || '줄거리 정보가 없어요.',
  }
}
export function toMovieCard(movie: TmdbMovieListItem): MovieCardData { return common(movie) }
export function formatRuntime(runtime: number | null): string {
  if (runtime === null || runtime <= 0) return '상영 시간 정보 없음'
  const hours = Math.floor(runtime / 60), minutes = runtime % 60
  return [hours ? `${hours}시간` : '', minutes ? `${minutes}분` : ''].filter(Boolean).join(' ')
}
export function toMovieDetail(movie: TmdbMovieDetail): Movie {
  return {
    ...common(movie),
    backdropPath: tmdbImage(movie.backdrop_path, 'w1280'),
    genres: movie.genres.map(genre => genre.name),
    runtime: formatRuntime(movie.runtime),
    tagline: movie.tagline || '태그라인 정보 없음',
  }
}
