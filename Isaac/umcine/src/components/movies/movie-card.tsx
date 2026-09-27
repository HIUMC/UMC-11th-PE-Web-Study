import type { Movie } from "../../types/movie";
import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article className="min-w-0">
        <div className="relative overflow-hidden rounded-lg bg-[#e8e9ec]">
          <Link to="/movies/$movieId"
            params={{ movieId: String(movie.id) }}
            >
        <img
            className="block aspect-[2/3] w-full object-cover"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
        />
        </Link>

        {/* <h2>{movie.title}</h2>
        <p>{movie.releaseDate}</p> */}

        <button
            type="button"
            className={cn(
                "absolute top-2 right-2 grid size-8 place-items-center",
                "rounded-[6px] border border-black/10 p-0",
                movie.isBookmarked
                  ? "bg-[#4f6ef7]"
                  : "bg-white/90",
            )}
            aria-label={
                movie.isBookmarked
                ? `${movie.title} 북마크 해제`
                : `${movie.title} 북마크 추가`
            }
            aria-pressed={movie.isBookmarked}
            onClick={() => onToggleBookmark(movie.id)}
            >
            <img
                src={
                movie.isBookmarked
                    ? "/icons/movie-icons/bookmark.svg"
                    : "/icons/movie-icons/bookmark-outline.svg"
                }
                alt=""
            />
            </button>
        </div>

         <h2 className="mt-3 mb-1 truncate text-[15px] leading-[1.4] font-bold">
        {movie.title}
      </h2>

      <p className="m-0 text-[13px] text-[#999999]">
        {movie.releaseDate}
      </p>
    </article>
  );
}