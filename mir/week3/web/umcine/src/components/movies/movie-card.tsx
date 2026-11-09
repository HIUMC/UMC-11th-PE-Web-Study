import { Link } from "@tanstack/react-router";
import { type Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="flex w-full flex-col gap-1"> 
      <div className="relative w-full overflow-hidden rounded-lg bg-[#F6F7F9] aspect-[241.6/274]">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="block h-full w-full">
          <img
            src={movie.posterPath}
            alt={movie.title}
            className="block h-full w-full object-cover transition-transform duration-200 ease-in-out hover:scale-[1.03]"
            loading="lazy"
          />
        </Link>
        
        <button
          type="button"
          className={cn(
            "absolute right-2 top-2 flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-white transition-colors duration-200 ease-in-out",
            movie.isBookmarked
              ? "border-[#2563EB] bg-[#2563EB]"
              : "bg-[#17191E] hover:bg-[#0f172a]"
          )}
          aria-pressed={movie.isBookmarked}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img 
            src={movie.isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"} 
            alt="북마크" 
            className="h-6 w-6 brightness-0 invert filter"
          />
        </button>
      </div>

      <div className="flex w-full flex-col text-left">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <h3 className="pt-[5px] m-0 truncate text-sm font-extrabold leading-[1.2] text-[#17191E]">
            {movie.title}
          </h3>
        </Link>
        <p className="m-0 text-xs font-normal leading-[14px] text-[#969DA8]">
          {movie.releaseDate}
        </p>
      </div>
    </article>
  );
}