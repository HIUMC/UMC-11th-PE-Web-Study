import { useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

export default function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(Number(movieId)),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  if (!movie) {
    return (
      <main className="mx-auto max-w-[1200px] px-6 py-16">
        <p className="text-[#a0a0a0]">영화를 찾을 수 없어요.</p>
      </main>
    );
  }

  return (
    <main className="relative">
      <div className="absolute inset-0 h-[420px] overflow-hidden">
        <img src={movie.backdropPath} alt="" className="h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#141414]" />
      </div>

      <div className="relative mx-auto flex max-w-[1200px] flex-col gap-8 px-6 pt-16 pb-16 md:flex-row">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="w-[240px] shrink-0 self-center rounded-xl md:self-start"
        />
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            <p className="mt-1 text-[#a0a0a0]">{movie.originalTitle}</p>
          </div>
          <p className="text-[#b2dab1]">{movie.tagline}</p>
          <div className="flex flex-wrap gap-2 text-sm text-[#a0a0a0]">
            <span>{movie.releaseDate}</span>
            <span>·</span>
            <span>{movie.runtime}</span>
          </div>
          <ul className="flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <li key={genre} className="rounded-full bg-[#262626] px-3 py-1 text-sm">
                {genre}
              </li>
            ))}
          </ul>
          <p className="mt-2 max-w-2xl leading-relaxed text-[#e0e0e0]">{movie.overview}</p>
          <button
            type="button"
            aria-pressed={isBookmarked}
            aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
            onClick={() => toggleBookmark(movie.id)}
            className={cn(
              "mt-2 flex w-fit items-center gap-2 rounded-lg border px-5 py-2.5 text-[15px] font-semibold transition-colors",
              isBookmarked
                ? "border-[#ffd43b] bg-[#ffd43b]/10 text-[#ffd43b]"
                : "border-[#444] bg-[#262626] text-[#f5f5f5] hover:border-[#ffd43b] hover:text-[#ffd43b]",
            )}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden="true"
              fill={isBookmarked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            >
              <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
            </svg>
            {isBookmarked ? "북마크 해제" : "북마크 추가"}
          </button>
        </div>
      </div>
    </main>
  );
}
