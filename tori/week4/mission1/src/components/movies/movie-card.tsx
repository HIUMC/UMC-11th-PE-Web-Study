import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "../bookmark-button"; // 경로는 파일 위치에 따라 조절

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const { id, title, releaseDate, posterPath } = movie;

  return (
    <li className="min-w-0">
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(id) }}
        className="block"
      >
        <div className="relative aspect-[8/9] overflow-hidden rounded-lg bg-gray-300">
          <img
            className="h-full w-full object-cover"
            src={posterPath}
            alt={`${title} 포스터`}
          />

          <BookmarkButton movieId={id} />
        </div>

        <h2 className="mt-2.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold leading-5">
          {title}
        </h2>

        <p className="mt-0.5 text-xs leading-[18px] text-text-muted">
          {releaseDate}
        </p>
      </Link>
    </li>
  );
}