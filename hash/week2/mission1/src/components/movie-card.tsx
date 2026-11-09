import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="movie-card__poster-wrap">
        <img
          className="movie-card__poster"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
        />

        <button
          className={`movie-card__bookmark ${
            movie.isBookmarked ? "movie-card__bookmark--active" : ""
          }`}
          type="button"
          aria-label={`${movie.title} 북마크 ${
            movie.isBookmarked ? "해제" : "추가"
          }`}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
            aria-hidden="true"
          />
        </button>
      </div>

      <h2 className="movie-card__title" title={movie.title}>
        {movie.title}
      </h2>
      <p className="movie-card__date">{movie.releaseDate}</p>
    </article>
  );
}