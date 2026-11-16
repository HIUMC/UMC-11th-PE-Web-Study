import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: TmdbMovieListItem;
  isFavorite: boolean;
  favoritesDisabled: boolean;
}

export default function MovieCard({
  movie,
  isFavorite,
  favoritesDisabled,
}: MovieCardProps) {
  const { id, title, release_date, poster_path } = movie;

  const posterUrl = getTmdbPosterUrl(poster_path);

  return (
    <li className="min-w-0">
      <div className="relative">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(id) }}
          className="block"
        >
          <div className="aspect-[8/9] overflow-hidden rounded-lg bg-gray-300">
            {posterUrl ? (
              <img
                className="h-full w-full object-cover"
                src={posterUrl}
                alt={`${title} 포스터`}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                이미지 없음
              </div>
            )}
          </div>

          <h2 className="mt-2.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold leading-5">
            {title}
          </h2>

          <p className="mt-0.5 text-xs leading-[18px] text-text-muted">
            {release_date}
          </p>
        </Link>

        <BookmarkButton
          movieId={id}
          isFavorite={isFavorite}
          disabled={favoritesDisabled}
        />
      </div>
    </li>
  );
}