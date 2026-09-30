import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";

interface SearchResultCardProps {
  movie: Movie;
}

export default function SearchResultCard({
  movie,
}: SearchResultCardProps) {
  const params = { movieId: String(movie.id) };

  return (
    <article className="grid grid-cols-[96px_minmax(0,1fr)] gap-4 border-b border-[#e4e7ee] py-5 sm:grid-cols-[128px_minmax(0,1fr)] sm:gap-5">
      <Link
        to="/movies/$movieId"
        params={params}
        aria-label={`${movie.title} 상세 보기`}
        className="block self-start overflow-hidden rounded-lg bg-gray-200"
      >
        <img
          src={movie.posterPath}
          alt={movie.title}
          className="aspect-[2/3] w-full object-cover transition-opacity hover:opacity-90"
        />
      </Link>

      <div className="flex min-w-0 flex-col items-start">
        <h2 className="text-base font-bold leading-snug sm:text-lg">
          <Link
            to="/movies/$movieId"
            params={params}
            className="hover:underline"
          >
            {movie.title}
          </Link>
        </h2>

        <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs text-[#8a909b]">
          <span>{movie.originalTitle}</span>
          <span>{movie.releaseDate}</span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-[#6b7280]">
          {movie.overview}
        </p>

        <Link
          to="/movies/$movieId"
          params={params}
          className="mt-auto pt-4 text-sm font-semibold text-[#4765df] hover:underline"
        >
          상세 보기 <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}