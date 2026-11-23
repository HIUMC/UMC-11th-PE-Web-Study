import Link from "next/link";
import type { MovieCardData } from "../../types/movie";
import { BookmarkButton } from "../bookmark-button";
import MovieImage from "./movie-image";

interface SearchResultCardProps {
  movie: MovieCardData;
}

export default function SearchResultCard({ movie }: SearchResultCardProps) {
  const href = `/movies/${movie.id}`;

  return (
    <article className="grid grid-cols-[96px_minmax(0,1fr)] gap-4 border-b border-[#e4e7ee] py-5 sm:grid-cols-[128px_minmax(0,1fr)] sm:gap-5">
      <Link
        href={href}
        aria-label={`${movie.title} 상세 보기`}
        className="block self-start overflow-hidden rounded-lg bg-gray-200"
      >
        <MovieImage
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          sizes="(max-width: 639px) 96px, 128px"
          className="aspect-[2/3] w-full transition-opacity hover:opacity-90"
        />
      </Link>
      <div className="flex min-w-0 flex-col items-start">
        <h2 className="text-base font-bold leading-snug sm:text-lg">
          <Link href={href} className="hover:underline">
            {movie.title}
          </Link>
        </h2>
        <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs text-[#8a909b]">
          <span>{movie.originalTitle}</span>
          <span>{movie.releaseDate || "개봉일 정보 없음"}</span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[#6b7280]">
          {movie.overview}
        </p>
        <BookmarkButton movieId={movie.id} movieTitle={movie.title} className="mt-4" />
        <Link
          href={href}
          className="mt-auto pt-4 text-sm font-semibold text-[#4765df] hover:underline"
        >
          상세 보기 <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
