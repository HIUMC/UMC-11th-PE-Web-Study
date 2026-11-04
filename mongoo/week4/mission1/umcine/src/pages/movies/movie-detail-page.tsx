import { Link } from "@tanstack/react-router";
import { Route } from "../../routes/movies.$movieId";
import { movies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

export function MovieDetailPage() {
  const { movieId } = Route.useParams();
  const movie = movies.find((m) => String(m.id) === movieId);

  const isBookmarked = useBookmarkStore((state) =>
    movie ? state.bookmarkedMovieIds.includes(movie.id) : false,
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  if (!movie) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-24 text-center text-gray-500">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  return (
    <main>
      {/* 배경 이미지 영역 */}
      <div
        className="relative flex h-80 flex-col justify-end bg-cover bg-center px-6 pb-8 text-white"
        style={{ backgroundImage: `url(${movie.backdropPath})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <Link to="/" className="mb-4 flex w-fit items-center gap-1 text-sm text-gray-200">
            <img src="/icons/chevron-left.svg" alt="" className="h-4 w-4 invert" />
            영화 목록
          </Link>
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <p className="text-gray-300">{movie.originalTitle}</p>
        </div>
      </div>

      {/* 메타 정보 */}
      <div className="mx-auto max-w-6xl px-6 py-4 text-sm text-gray-500">
        {movie.releaseDate}
        {movie.genres.length > 0 && `  ${movie.genres.join(" · ")}`}
        {movie.runtime && `  ${movie.runtime}`}
      </div>

      {/* 본문 */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 border-t px-6 py-6 md:grid-cols-[240px_1fr_320px]">
        <img src={movie.posterPath} alt={movie.title} className="w-60 rounded-lg shadow" />

        <div>
          <h2 className="mb-3 text-xl font-bold text-gray-900">{movie.tagline}</h2>
          <p className="whitespace-pre-line text-gray-800">{movie.overview}</p>
          <button
            type="button"
            aria-pressed={isBookmarked}
            onClick={() => toggleBookmark(movie.id)}
            className={cn(
              "mt-4 flex items-center gap-2 rounded border px-4 py-2 text-sm font-semibold transition-colors",
              isBookmarked
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-blue-600 text-blue-600 hover:bg-blue-50",
            )}
          >
            <img
              src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
              alt=""
              className={cn("h-4 w-4", isBookmarked && "invert")}
            />
            {isBookmarked ? "즐겨찾기 완료" : "즐겨찾기"}
          </button>
        </div>

        <div className="h-fit rounded-lg border p-4">
          <h2 className="mb-2 font-bold text-gray-900">내 평점</h2>
          <p className="mb-2 text-sm text-gray-500">별점은 필수, 후기는 선택이에요.</p>
          <div className="mb-3 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <img key={i} src="/icons/star-outline.svg" alt="" className="h-6 w-6" />
            ))}
          </div>
          <textarea
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="mb-3 h-24 w-full rounded border p-2 text-sm outline-none focus:border-black"
          />
          <button type="button" className="w-full rounded bg-black py-2 text-sm font-semibold text-white">
            평점 저장
          </button>
        </div>
      </div>
    </main>
  );
}