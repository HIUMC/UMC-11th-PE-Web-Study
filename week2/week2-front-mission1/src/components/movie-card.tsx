import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="poster-wrap">
        <img className="movie-poster" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        <button
          className={`bookmark-button${movie.isBookmarked ? " bookmarked" : ""}`}
          type="button"
          aria-label={`${movie.title} ${movie.isBookmarked ? "북마크 해제" : "북마크 추가"}`}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img src={movie.isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"} alt="" />
        </button>
        <span className="poster-shade" />
      </div>
      <div className="movie-info">
        <h2>{movie.title}</h2>
        <p className="movie-original-title">{movie.originalTitle}</p>
        <div className="movie-meta">
          <span>{movie.releaseDate.slice(0, 4)}</span>
          <span className="meta-divider" />
          <span>{movie.genres.slice(0, 2).join(" · ")}</span>
        </div>
      </div>
    </article>
  );
}

export default MovieCard;
