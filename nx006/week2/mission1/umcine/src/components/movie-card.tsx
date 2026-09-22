import type { Movie } from '../types/movie'
import { Icon } from './icon'

interface MovieCardProps {
  movie: Movie
  onToggleBookmark: (movieId: number) => void
  showBookmark?: boolean
}

export function MovieCard({ movie, onToggleBookmark, showBookmark = true }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="poster-wrap">
        <a href={`#/movies/${movie.id}`} aria-label={movie.title + ' 상세 보기'}><img className="movie-poster" src={movie.posterPath}
          alt={movie.title + ' 포스터'} loading="lazy" /></a>
      {showBookmark && <button type="button" className="bookmark-button"
        aria-label={movie.title + ' 북마크'}
        aria-pressed={movie.isBookmarked}
        onClick={() => onToggleBookmark(movie.id)}>
        <Icon name={movie.isBookmarked ? 'bookmark' : 'bookmark-outline'} />
      </button>}
      </div>
      <h2><a href={`#/movies/${movie.id}`}>{movie.title}</a></h2>
      <p>{movie.releaseDate}</p>
    </article>
  )
}
