import { Link } from "@tanstack/react-router";
import type { Movie } from "../../type/movie_type";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <div className="flex flex-col">
      <div className="group relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-gray-100">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="block h-full w-full">
          <img
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            src={movie.posterPath}
            alt={movie.title}
            loading="lazy"
          />
        </Link>

        {/* 북마크 토글 버튼: cn 유틸 적용 */}
        <button
          type="button"
          aria-label="북마크 토글"
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(movie.id);
          }}
          className={cn(
            "absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-lg shadow-sm transition-colors",
            movie.isBookmarked
              ? "bg-blue-600 text-white"
              : "bg-black/50 text-white/90 backdrop-blur-xs hover:bg-black/70"
          )}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={movie.isBookmarked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      <div className="mt-2.5 flex flex-col">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <h3 className="truncate text-sm font-bold text-gray-900 transition-colors hover:text-blue-600">
            {movie.title}
          </h3>
        </Link>
        <p className="mt-0.5 text-xs text-gray-400">{movie.releaseDate}</p>
      </div>
    </div>
  );
}