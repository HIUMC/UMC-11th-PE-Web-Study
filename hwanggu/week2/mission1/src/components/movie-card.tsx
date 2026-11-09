import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="movie-card__poster">
        <img src={movie.posterPath} alt={`${movie.title} 포스터`} loading="lazy" />
        <button
          type="button"
          className={movie.isBookmarked ? "movie-card__bookmark is-active" : "movie-card__bookmark"}
          aria-pressed={movie.isBookmarked}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
          </svg>
        </button>
        <div className="movie-card__overlay">
          <p className="movie-card__overlay-title">{movie.title}</p>
          <p className="movie-card__overlay-overview">{movie.overview}</p>
        </div>
      </div>
      <h2 className="movie-card__title">{movie.title}</h2>
      <p className="movie-card__date">{movie.releaseDate}</p>
    </article>
  );
}
