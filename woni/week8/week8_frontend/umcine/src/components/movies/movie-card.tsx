import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { MovieCardItem } from "../../types/movie-card";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: MovieCardItem;
  // 포스터 오른쪽 위 버튼 (없으면 기존 BookmarkButton)
  actionButton?: ReactNode;
}

export function MovieCard({ movie, actionButton }: MovieCardProps) {
  return (
    <article className="flex flex-col gap-2">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-300">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block size-full"
        >
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={`${movie.title} 포스터`}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-sm text-gray-500">
              이미지 없음
            </div>
          )}
        </Link>
        {actionButton ?? (
          <BookmarkButton movieId={movie.id} movieTitle={movie.title} />
        )}
      </div>
      <h2 className="truncate text-[15px] font-semibold">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          {movie.title}
        </Link>
      </h2>
      <p className="text-[13px] text-gray-500">{movie.releaseDate}</p>
    </article>
  );
}
