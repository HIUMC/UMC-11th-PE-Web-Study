import { Link } from "@tanstack/react-router";
import type { MovieCardData } from "../../types/movie";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";
import MovieImage from "./movie-image";

interface MovieCardProps {
  movie: MovieCardData;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const isBookmarked = useBookmarkStore(
    (state) => state.bookmarkedMovieIds.includes(movie.id),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <article className="min-w-0">
      <div className="relative aspect-[175/198] w-full overflow-hidden rounded-[9px] bg-gray-200">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block h-full"
          aria-label={`${movie.title} 상세 보기`}
        >
          <MovieImage
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="block h-full w-full object-cover"
          />
        </Link>
        <button
          type="button"
          onClick={() => toggleBookmark(movie.id)}
          aria-label={`${movie.title} 북마크 ${isBookmarked ? "해제" : "추가"}`}
          aria-pressed={isBookmarked}
          className={cn(
            "absolute right-2 top-2 grid h-[30px] w-7 cursor-pointer place-items-center rounded-[5px] border p-0 transition-colors",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400",
            isBookmarked
              ? "border-[#4765df] bg-[#4765df]"
              : "border-white bg-[#141820]/90",
          )}
        >
          <img
            src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
            alt=""
            className="h-5 w-5 invert"
          />
        </button>
      </div>
      <h2
        className="mb-[3px] mt-[7px] truncate text-xs font-bold leading-[1.4]"
        title={movie.title}
      >
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="text-inherit no-underline hover:underline"
        >
          {movie.title}
        </Link>
      </h2>
      <p className="m-0 text-[10px] leading-[1.4] text-[#8a909b]">
        {movie.releaseDate || "개봉일 정보 없음"}
      </p>
    </article>
  );
}
