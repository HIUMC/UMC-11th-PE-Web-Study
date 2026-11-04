import { Link } from "@tanstack/react-router";
import { type Movie } from "../../types/movie";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="flex w-full flex-col gap-1">
      <div className="relative w-full overflow-hidden rounded-lg bg-[#F6F7F9] aspect-[241.6/274]">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block h-full w-full"
        >
          <img
            src={movie.posterPath}
            alt={movie.title}
            className="block h-full w-full object-cover transition-transform duration-200 ease-in-out hover:scale-[1.03]"
            loading="lazy"
          />
        </Link>

        <div className="absolute right-2 top-2">
          <BookmarkButton movieId={movie.id} />
        </div>
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
