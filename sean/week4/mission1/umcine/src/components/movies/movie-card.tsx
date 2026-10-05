import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <li>
      <div className="relative overflow-hidden rounded-lg">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          >
          <img
            className="block aspect-2/3 w-full object-cover"
            src={movie.posterPath} 
            alt={`${movie.title} 포스터`} 
          />
        </Link>
        <BookmarkButton movieId={movie.id} className="absolute right-2 top-2 h-8 w-8 border-transparent" />
      </div>
      <p className="mt-2 text-sm font-medium text-neutral-900">{movie.title}</p>
      <p className="mt-1 text-xs text-neutral-500">{movie.releaseDate}</p>
    </li>
  );
}
