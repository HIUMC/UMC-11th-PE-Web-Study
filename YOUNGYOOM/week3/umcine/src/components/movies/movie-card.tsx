import type { Movie } from "../../types/movie.ts";
import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookMark: (movieId: number) => void;
}

export const MovieCard = ({ movie, onToggleBookMark }: MovieCardProps) => {
  return (
    <div className="flex flex-col gap-1 w-[241px]">
      <div className="relative overflow-hidden">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img
            src={movie.posterPath}
            alt={movie.title}
            className="rounded-xl h-[274px] w-[241px]"
          />
        </Link>
        <button
          className={cn(
            "absolute top-4 right-4 flex items-center justify-center h-8 w-8 rounded-lg transition-colors",
            movie.isBookmarked
              ? "bg-blue-600"
              : "bg-gray-100 hover:bg-gray-200",
          )}
          onClick={() => onToggleBookMark(movie.id)}
        >
          <img
            src={
              movie.isBookmarked
                ? "icons/bookmark.svg"
                : "icons/bookmark-outline.svg"
            }
            alt={movie.title}
          />
        </button>
      </div>
      <div className="flex flex-col">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <h6 className="font-extrabold text-[14px]">{movie.title}</h6>
        </Link>
        <p className="text-[12px] text-gray-400">{movie.releaseDate}</p>
      </div>
    </div>
  );
};
