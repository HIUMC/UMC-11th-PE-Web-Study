import { type Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card"> 
      <div className="poster-wrapper">
        <img
          src={movie.posterPath}
          alt={movie.title}
          className="poster-image"
          loading="lazy"
        />
        <button
          type="button"
          className={`bookmark-button ${movie.isBookmarked ? "active" : ""}`}
          aria-pressed={movie.isBookmarked}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
            className="bookmark-icon"
          />
        </button>
      </div>

      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-date">{movie.releaseDate}</p>
      </div>
    </article>
  );
}