import { Link } from "@tanstack/react-router";
import { BookmarkButton } from "./bookmark-button";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <li>
      <div className="relative overflow-hidden rounded-lg">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          {posterUrl ? (
            <img
              className="block aspect-2/3 w-full object-cover"
              src={posterUrl}
              alt={`${movie.title} 포스터`}
            />
          ) : (
            <div className="flex aspect-2/3 w-full items-center justify-center bg-neutral-200 text-xs text-neutral-500">
              이미지 없음
            </div>
          )}
        </Link>
        <BookmarkButton
          movieId={movie.id}
          className="absolute right-2 top-2 h-8 w-8 border-transparent"
        />
      </div>
      <p className="mt-2 text-sm font-medium text-neutral-900">{movie.title}</p>
      <p className="mt-1 text-xs text-neutral-500">{movie.release_date}</p>
    </li>
  );
}