import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  const { id, title, releaseDate, posterPath, isBookmarked } = movie;

  return (
    <li className="min-w-0">
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(id) }}
        className="block"
      >
        <div className="relative aspect-[8/9] overflow-hidden rounded-lg bg-gray-300">
          <img className="h-full w-full object-cover" src={posterPath} alt={`${title} 포스터`} />
          <button
            type="button"
            className={cn(
              "absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md border border-white bg-gray-900",
              isBookmarked && "border-primary bg-primary",
            )}
            aria-label={isBookmarked ? `${title} 북마크 해제` : `${title} 북마크 추가`}
            aria-pressed={isBookmarked}
            onClick={(event) => {
              event.preventDefault(); // Link 이동 막기
              event.stopPropagation(); // 클릭이 Link까지 전달 안 되게 막기
              onToggleBookmark(id);
            }}
          >
            <img
              className="h-[18px] w-[18px] brightness-0 invert"
              src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
              alt=""
            />
          </button>
        </div>
        <h2 className="mt-2.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold leading-5">
          {title}
        </h2>
        <p className="mt-0.5 text-xs leading-[18px] text-text-muted">{releaseDate}</p>
      </Link>
    </li>
  );
}