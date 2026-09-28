import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  const { id, title, releaseDate, posterPath, isBookmarked } = movie;
  const iconPath = isBookmarked
    ? "/icons/bookmark.svg"
    : "/icons/bookmark-outline.svg";

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
        <button
          type="button"
          className={cn(
            "absolute right-2.5 top-2.5 flex size-9 items-center justify-center rounded-md border border-white/90 bg-slate-950/60 text-white transition-colors hover:bg-slate-950/80",
            isBookmarked && "border-blue-600 bg-blue-600 hover:bg-blue-700",
          )}
          aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
          aria-pressed={isBookmarked}
          onClick={() => onToggleBookmark(id)}
        >
          <span
            className="size-[22px] bg-current [mask:var(--icon)_center/contain_no-repeat] [-webkit-mask:var(--icon)_center/contain_no-repeat]"
            style={{ "--icon": `url(${iconPath})` } as React.CSSProperties}
          />
        </button>
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
