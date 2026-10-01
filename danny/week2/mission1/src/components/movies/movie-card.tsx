import "./movie-card.css";
import type { Movie } from "../../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <div className="movie-card">
      <div className="movie-card__poster-wrap">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="movie-card__poster"
        />
        <button
          type="button"
          aria-label={movie.isBookmarked ? "즐겨찾기 해제" : "즐겨찾기 추가"}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
          className={
            movie.isBookmarked
              ? "movie-card__bookmark-button movie-card__bookmark-button--active"
              : "movie-card__bookmark-button"
          }
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>
      <div>
        <h3 className="movie-card__title">{movie.title}</h3>
        <p className="movie-card__date">{movie.releaseDate}</p>
      </div>
    </div>
  );
}
