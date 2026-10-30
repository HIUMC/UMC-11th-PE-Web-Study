import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../api/movies/models";
import { getTmdbPosterUrl } from "../utils/movies/tmdb-image";
import BookmarkButton from "./bookmark-button";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <article className="movie-card">
      <div className="poster-wrapper">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          {posterUrl ? (
            <img
              className="movie-poster"
              src={posterUrl}
              alt={`${movie.title} 포스터`}
            />
          ) : (
            <div className="movie-poster movie-poster-placeholder">
              이미지 없음
            </div>
          )}
        </Link>

        <BookmarkButton movieId={movie.id} variant="icon" />
      </div>

      <h3>
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          {movie.title}
        </Link>
      </h3>

      <p>{movie.release_date}</p>
    </article>
  );
}