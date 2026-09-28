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
      <div className="poster-wrapper">
        <img
          className="movie-poster"
          src={movie.posterPath}
          alt={movie.title}
        />

        <button
          className={`bookmark-button ${
            movie.isBookmarked ? "bookmarked" : ""
          }`}
          aria-label={
            movie.isBookmarked
              ? `${movie.title} 북마크 해제`
              : `${movie.title} 북마크 추가`
          }
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={movie.isBookmarked ? "white" : "none"}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 4.5C6 3.67 6.67 3 7.5 3H16.5C17.33 3 18 3.67 18 4.5V21L12 17.5L6 21V4.5Z"
              stroke="white"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <h2 className="movie-title">{movie.title}</h2>

      <p className="movie-release-date">
        {movie.releaseDate}
      </p>
    </article>
  );
}