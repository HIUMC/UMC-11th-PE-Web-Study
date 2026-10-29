import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  const bookmarkLabel = movie.isBookmarked
    ? `${movie.title} 북마크 해제`
    : `${movie.title} 북마크 추가`;

  return (
    <article className="movie-card">
      <div className="poster-wrap">
        <img className="poster" src={movie.posterPath} alt={movie.title} />
        <button
          className={`bookmark ${movie.isBookmarked ? "selected" : ""}`}
          type="button"
          aria-label={bookmarkLabel}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        />
      </div>
      <h2>{movie.title}</h2>
      <p>{movie.releaseDate}</p>
    </article>
  );
}
