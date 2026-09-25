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
            alt={`${movie.title} 포스터`}
        />

        {/* <h2>{movie.title}</h2>
        <p>{movie.releaseDate}</p> */}

        <button
            type="button"
            className="bookmark-button"
            aria-label={
                movie.isBookmarked
                ? `${movie.title} 북마크 해제`
                : `${movie.title} 북마크 추가`
            }
            aria-pressed={movie.isBookmarked}
            onClick={() => onToggleBookmark(movie.id)}
            >
            <img
                src={
                movie.isBookmarked
                    ? "/icons/movie-icons/bookmark.svg"
                    : "/icons/movie-icons/bookmark-outline.svg"
                }
                alt=""
            />
            </button>
        </div>

        <h2 className="movie-title">{movie.title}</h2>
        <p className="movie-release-date">{movie.releaseDate}</p>
    </article>
  );
}