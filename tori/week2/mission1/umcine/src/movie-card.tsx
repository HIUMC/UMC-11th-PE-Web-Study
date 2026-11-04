import type { Movie } from "./types/movie";
import "./movie-card.css";
 
interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}
 
export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  const { id, title, releaseDate, posterPath, isBookmarked } = movie;
 
  return (
    <li className="movie-card">
      <div className="movie-card-poster">
        <img className="movie-card-image" src={posterPath} alt={`${title} 포스터`} />
        <button
          type="button"
          className={`bookmark-button${isBookmarked ? " bookmark-button-active" : ""}`}
          aria-label={isBookmarked ? `${title} 북마크 해제` : `${title} 북마크 추가`}
          aria-pressed={isBookmarked}
          onClick={() => onToggleBookmark(id)}
        >
          <img
            src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
            alt=""
          />
        </button>
      </div>
      <h2 className="movie-card-title">{title}</h2>
      <p className="movie-card-date">{releaseDate}</p>
    </li>
  );
}