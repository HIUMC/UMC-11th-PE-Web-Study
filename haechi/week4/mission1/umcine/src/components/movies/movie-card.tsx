import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const { id, title, releaseDate, posterPath } = movie;
  const detailLinkProps = {
    to: "/movies/$movieId",
    params: { movieId: String(id) },
  } as const;

  return (
    <article className="flex flex-col gap-1">
      <div className="relative h-[274px] overflow-hidden rounded-[10px] bg-page">
        {/* 북마크 버튼이 Link 안에 중첩되지 않도록 포스터만 Link로 감싸요. */}
        <Link {...detailLinkProps} className="block size-full" tabIndex={-1}>
          <img
            src={posterPath}
            alt={`${title} 포스터`}
            className="size-full object-cover transition-transform duration-200 hover:scale-[1.03]"
          />
        </Link>
        <BookmarkButton movieId={id} movieTitle={title} className="absolute right-2.5 top-2.5" />
      </div>
      <h3 className="truncate pt-[5px] text-sm font-extrabold">
        <Link {...detailLinkProps} className="hover:underline">
          {title}
        </Link>
      </h3>
      <p className="text-xs text-ink-tertiary">{releaseDate}</p>
    </article>
  );
}
