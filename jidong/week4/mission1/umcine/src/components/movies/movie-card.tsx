import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="flex flex-col gap-2">
      <div className="relative aspect-[2/3] overflow-hidden rounded-[10px]">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img
            src={movie.posterPath}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
        </Link>
        <BookmarkButton
          movieId={movie.id}
          movieTitle={movie.title}
          className="absolute right-2 top-2"
        />
      </div>
      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <h3 className="text-sm">{movie.title}</h3>
      </Link>
      <p className="text-[13px] text-gray-500">{movie.releaseDate}</p>
    </article>
  );
}
