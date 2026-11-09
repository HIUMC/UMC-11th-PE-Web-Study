import type { Movie } from "../../types/movie";
import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="flex flex-col items-start gap-1">
      <div className="relative h-[274px] w-[241.6px] overflow-hidden rounded-[10px]">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img
            className="block size-full object-cover"
            src={movie.posterPath}
            alt="Movie Poster"
          />
        </Link>

        <div
          className={cn(
            "absolute right-[9.8px] top-[10px] z-[1] box-border flex size-[34px] items-center justify-center rounded-[8px] border p-[7.5px_6px]",
            movie.isBookmarked
              ? "border-[#2563eb] bg-[#2563eb]"
              : "border-white bg-[#17191e]",
          )}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={
              "icons/" +
              (movie.isBookmarked ? "bookmark.svg" : "bookmark-outline.svg")
            }
            alt="Bookmark"
            className="size-6 shrink-0 brightness-0 invert"
          />
        </div>
      </div>
      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <div className="flex h-[17px] w-[241.6px] items-center py-[5px] text-[14px] leading-[17px] font-extrabold text-[#17191e] [font-family:Pretendard]">
          {movie.title}
        </div>
        <div className="flex h-[14px] w-[241.6px] items-center text-[12px] leading-[14px] font-normal text-[#969da8] [font-family:Pretendard]">
          {movie.releaseDate}
        </div>
      </Link>
    </article>
  );
}

export default MovieCard;
