import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  const { id, title, releaseDate, posterPath, isBookmarked } = movie;
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
        <button
          type="button"
          aria-label={`${title} 북마크`}
          aria-pressed={isBookmarked}
          onClick={() => onToggleBookmark(id)}
          className={cn(
            "absolute right-2.5 top-2.5 flex size-[34px] items-center justify-center rounded-lg border p-0",
            isBookmarked ? "border-primary bg-primary" : "border-surface bg-ink",
          )}
        >
          <img
            src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
            alt=""
            width={24}
            height={24}
            // 제공된 아이콘은 검은색이라 흰색으로 반전
            className="invert"
          />
        </button>
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
