import type { Movie } from '../types/movie'

interface MovieCardProps {
  movie: Movie
  onToggleBookmark: (movieId: number) => void
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <li className="movie-card">
      <div className="movie-poster-wrap">
        <img className="movie-poster" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        <button
          className={`bookmark-button${movie.isBookmarked ? ' is-bookmarked' : ''}`}
          type="button"
          aria-label={`${movie.title} 북마크`}
          aria-pressed={movie.isBookmarked}
          title={movie.isBookmarked ? '북마크 해제' : '북마크 추가'}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img src={`/icons/movie-icons/${movie.isBookmarked ? 'bookmark' : 'bookmark-outline'}.svg`} alt="" width="24" height="24" />
        </button>
      </div>
      <h2 className="movie-title">{movie.title}</h2>
      <time className="movie-release-date" dateTime={movie.releaseDate.replaceAll('.', '-')}>
        {movie.releaseDate}
      </time>
    </li>
  )
}
