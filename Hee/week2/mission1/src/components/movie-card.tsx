import type { Movie } from "../types/movie";

type MovieCardProps = {
  movie: Movie;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
};

const bookmarkIcon = "/icons/movie-icons/movie-icons/bookmark.svg";
const bookmarkOutlineIcon = "/icons/movie-icons/movie-icons/bookmark-outline.svg";

export default function MovieCard({ movie, isBookmarked, onToggleBookmark }: MovieCardProps) {
  return (
    <article>
      <div className="relative aspect-[205/232] overflow-hidden rounded-[8px]">
        <img src={movie.posterPath} alt={`${movie.title} 포스터`} className="h-full w-full object-cover" />
        <button
          type="button"
          onClick={() => onToggleBookmark(movie.id)}
          aria-label={`${movie.title} 북마크 ${isBookmarked ? "해제" : "추가"}`}
          aria-pressed={isBookmarked}
          className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-[6px] border ${
            isBookmarked ? "border-[#2F6FED] bg-[#2F6FED]" : "border-white bg-black/60"
          }`}
        >
          <img src={isBookmarked ? bookmarkIcon : bookmarkOutlineIcon} alt="" className="h-[17px] w-[17px] invert" />
        </button>
      </div>
      <h2 className="mt-2 text-[12px] font-semibold text-[#191D23]">{movie.title}</h2>
      <p className="mt-[2px] text-[11px] text-[#9CA3AF]">{movie.releaseDate}</p>
    </article>
  );
}
