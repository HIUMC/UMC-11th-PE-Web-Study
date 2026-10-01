import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="movie-card-poster">
        <img src={movie.posterPath} alt={movie.title} loading="lazy" />
        <button
          type="button"
          className={`bookmark-button ${movie.isBookmarked ? "is-active" : ""}`}
          aria-pressed={movie.isBookmarked}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          onClick={() => onToggleBookmark(movie.id)}
        >
          {movie.isBookmarked ? "★" : "☆"}
        </button>
      </div>

      <div className="movie-card-body">
        <h3 className="movie-card-title">{movie.title}</h3>
        <p className="movie-card-meta">
          {movie.releaseDate} · {movie.genres.join(", ")}
        </p>
      </div>
    </article>
  );
}