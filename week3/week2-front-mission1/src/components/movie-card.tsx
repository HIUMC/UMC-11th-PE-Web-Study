import type { MouseEvent } from "react";
import type { Movie } from "../types/movie";
import { cn } from "../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  const handleBookmarkClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onToggleBookmark(movie.id);
  };

  return (
    <article className="group relative min-w-0">
      <a className="block" href={`/movies/${movie.id}`}>
        <div className="relative aspect-[214/321] overflow-hidden rounded-lg bg-[#20232b] shadow-[0_18px_44px_rgba(0,0,0,0.34)]">
          <img
            className="block h-full w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-[1.035]"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-black/60" />
        </div>
        <div className="pt-3.5">
          <h2 className="overflow-hidden text-ellipsis whitespace-nowrap text-[17px] leading-[1.35] font-extrabold text-white">
            {movie.title}
          </h2>
          <p className="mt-[5px] mb-[9px] overflow-hidden text-ellipsis whitespace-nowrap text-[13px] leading-[1.35] text-[#9da3ae]">
            {movie.originalTitle}
          </p>
          <div className="flex min-h-5 items-center gap-2 text-[13px] font-bold text-[#c9ced7]">
            <span>{movie.releaseDate}</span>
            <span className="h-1 w-1 rounded-full bg-[#646a75]" />
            <span>{movie.genres.slice(0, 2).join(" · ")}</span>
          </div>
          <p className="mt-2.5 line-clamp-2 min-h-10 overflow-hidden text-[13px] leading-[1.55] text-[#8e95a1]">
            {movie.overview}
          </p>
        </div>
      </a>
      <button
        className={cn(
          "absolute top-3 right-3 z-[1] inline-flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-white/24 bg-[#0f1013]/68 shadow-[0_10px_24px_rgba(0,0,0,0.28)] transition duration-150 hover:-translate-y-px hover:border-white/42 hover:bg-[#0f1013]/90",
          movie.isBookmarked && "border-[#f04252]/70 bg-[#f04252]",
        )}
        type="button"
        aria-label={`${movie.title} ${movie.isBookmarked ? "북마크 해제" : "북마크 추가"}`}
        aria-pressed={movie.isBookmarked}
        onClick={handleBookmarkClick}
      >
        <img
          className="h-5 w-5"
          src={
            movie.isBookmarked
              ? "/icons/bookmark.svg"
              : "/icons/bookmark-outline.svg"
          }
          alt=""
        />
      </button>
    </article>
  );
}

export default MovieCard;
