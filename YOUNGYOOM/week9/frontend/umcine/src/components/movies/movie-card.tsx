import type { Movie } from "../../types/movie.ts";
import Link from "next/link";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: Movie;
  onToggleBookMark: (movieId: number) => void;
}

export const MovieCard = ({ movie, onToggleBookMark }: MovieCardProps) => {
  return (
    <div className="flex flex-col gap-1 w-[241px]">
      <div className="relative overflow-hidden">
        <Link href={`/movies/${movie.id}`}>
          <img
            src={movie.posterPath}
            alt={movie.title}
            className="rounded-xl h-[274px] w-[241px]"
          />
        </Link>
        <div className="absolute top-3 right-3">
          <BookmarkButton movieId={movie.id} />
        </div>
      </div>
      <div className="flex flex-col">
        <Link href={`/movies/${movie.id}`}>
          <h6 className="font-extrabold text-[14px]">{movie.title}</h6>
        </Link>
        <p className="text-[12px] text-gray-400">{movie.releaseDate}</p>
      </div>
    </div>
  );
};
