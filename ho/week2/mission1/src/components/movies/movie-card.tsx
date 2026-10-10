import { Link } from "@tanstack/react-router";
import { BookmarkButton } from "../bookmark-button";
import type { Movie } from "../../types/movie";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const { id, title, releaseDate, posterPath } = movie;

  return (
    <article className="min-w-0">
      <div className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-slate-200 shadow-sm">
        <Link
          to="/movies/$movieId"
          params={(previous) => ({ ...previous, movieId: String(id) })}
          aria-label={`${title} 상세 보기`}
        >
          <img
            src={posterPath}
            alt={`${title} 포스터`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </Link>
        <BookmarkButton movieId={id} />
      </div>
      <h2 className="mt-2.5 truncate text-[15px] font-bold leading-5">
        <Link
          to="/movies/$movieId"
          params={(previous) => ({ ...previous, movieId: String(id) })}
          className="hover:text-blue-600"
        >
          {title}
        </Link>
      </h2>
      <p className="mt-1 text-xs text-slate-400">{releaseDate}</p>
    </article>
  );
}
