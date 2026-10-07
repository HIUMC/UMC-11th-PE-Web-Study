import { Link } from "@tanstack/react-router";
import type { Movie } from "../../type/movie_type";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
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

        {/* 북마크 토글 버튼: Zustand 전역 상태 사용 */}
        <BookmarkButton movieId={movie.id} variant="overlay" />
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