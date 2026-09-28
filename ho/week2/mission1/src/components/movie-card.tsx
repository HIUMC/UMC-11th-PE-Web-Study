import "./movie-card.css";
import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  const { id, title, releaseDate, posterPath, isBookmarked } = movie;
  const iconPath = isBookmarked
    ? "/icons/bookmark.svg"
    : "/icons/bookmark-outline.svg";

  return (
    <article className="movie-card">
      <div className="movie-card-poster">
        <img src={posterPath} alt={`${title} 포스터`} />
        <button
          type="button"
          className={`movie-card-bookmark${isBookmarked ? " is-active" : ""}`}
          aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
          aria-pressed={isBookmarked}
          onClick={() => onToggleBookmark(id)}
        >
          <span
            className="icon"
            style={{ "--icon": `url(${iconPath})` } as React.CSSProperties}
          />
        </button>
      </div>
      <h2 className="movie-card-title">{title}</h2>
      <p className="movie-card-date">{releaseDate}</p>
    </article>
  );
}
