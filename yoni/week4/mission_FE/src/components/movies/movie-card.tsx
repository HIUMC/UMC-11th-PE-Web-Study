import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  id: number;
  title: string;
  releaseDate: string;
  posterPath: string;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export default function MovieCard({
  id,
  title,
  releaseDate,
  posterPath,
  isBookmarked,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article className="min-w-0 text-left">
      <div className="relative w-full">
        <Link to="/movies/$movieId" params={{ movieId: String(id) }}>
          <img
            className="block aspect-[7/8] w-full rounded-lg object-cover"
            src={posterPath}
            alt={`${title} 포스터`}
          />
        </Link>

        <button
          type="button"
          className={cn(
            "absolute top-2 right-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-[5px] border-[1.5px] p-1",
            isBookmarked
              ? "border-[#2563eb] bg-[#2563eb]"
              : "border-white bg-[rgba(20,20,20,0.85)]",
          )}
          onClick={onToggleBookmark}
          aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
        >
          <img
            className="block h-[18px] w-[18px] brightness-0 invert"
            src={
              isBookmarked
                ? "/icons/movie-icons/bookmark.svg"
                : "/icons/movie-icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>

      <Link to="/movies/$movieId" params={{ movieId: String(id) }}>
        <h2 className="mt-2 mb-[3px] overflow-hidden text-ellipsis whitespace-nowrap text-[13px] leading-[1.4] font-semibold text-[#1f1f1f]">
          {title}
        </h2>
      </Link>

      <p className="m-0 text-[11px] leading-[1.4] font-normal text-[#9ca3af]">
        {releaseDate}
      </p>
    </article>
  );
}
