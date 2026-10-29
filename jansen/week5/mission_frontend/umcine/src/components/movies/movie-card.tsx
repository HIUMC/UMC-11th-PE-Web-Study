import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const releaseDate = movie.release_date.replace(/-/g, ".");

  return (
    <article>
      <div className="relative aspect-[7/8] overflow-hidden rounded-xl bg-line">
        <Link
          className="block h-full"
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              loading="lazy"
              className="block h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[13px] text-muted">
              이미지 없음
            </div>
          )}
        </Link>
        <BookmarkButton movieId={movie.id} className="absolute right-2 top-2" />
      </div>

      <h3 className="mt-2.5 truncate text-[15px] font-bold text-ink">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          {movie.title}
        </Link>
      </h3>
      <p className="mt-1 text-[13px] text-muted">
        {releaseDate || "개봉일 정보 없음"}
      </p>
    </article>
  );
}