import type { Movie } from "./../types/moive.ts";
import "./movie-card.css";

interface MovieCardProps {
  movie: Movie;
  onToggleBookMark: (movieId: number) => void;
}

export const MovieCard = ({ movie, onToggleBookMark }: MovieCardProps) => {
  return (
    <div className="card_container">
      <div className="poster">
        <img
          src={movie.posterPath}
          alt={movie.title}
          className="movie_poster"
        />
        <button
          className={
            movie.isBookmarked ? "bookmark_button active" : "bookmark_button"
          }
          onClick={() => onToggleBookMark(movie.id)}
        >
          <img
            src={
              movie.isBookmarked
                ? "icons/bookmark.svg"
                : "icons/bookmark-outline.svg"
            }
            alt={movie.title}
            className="bookmark"
          />
        </button>
      </div>
      <div className="information">
        <h6>{movie.title}</h6>
        <p>{movie.releaseDate}</p>
      </div>
    </div>
  );
};
