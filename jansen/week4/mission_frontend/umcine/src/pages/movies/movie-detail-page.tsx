import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";
import { BookmarkIcon, ChevronLeftIcon, StarIcon } from "../../components/icons";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));
  const [rating, setRating] = useState(0);

  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(Number(movieId)),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  if (!movie) {
    return <main className="px-20 py-10">영화를 찾을 수 없어요.</main>;
  }

  return (
    <main>
      <section className="relative h-[360px] overflow-hidden bg-ink text-white">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-black/30" />

        <Link
          to="/"
          className="absolute left-20 top-8 flex items-center gap-1 text-sm font-semibold"
        >
          <ChevronLeftIcon className="size-4" />
          영화 목록
        </Link>

        <div className="absolute bottom-8 left-20">
          <h1 className="text-[48px] font-extrabold leading-tight">{movie.title}</h1>
          <p className="mt-2 text-base">{movie.originalTitle}</p>
          <p className="mt-2 text-sm font-semibold">
            {movie.releaseDate} · {movie.genres.join(" · ")} {movie.runtime}
          </p>
        </div>
      </section>

      <div className="flex gap-10 px-20 py-8 max-[960px]:flex-col">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="aspect-[2/3] w-[200px] shrink-0 rounded-xl object-cover shadow-lg"
        />

        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold">{movie.tagline}</h2>
          <p className="mt-4 max-w-[640px] whitespace-pre-line leading-7 text-muted">
            {movie.overview}
          </p>
          <button
            type="button"
            aria-pressed={isBookmarked}
            onClick={() => toggleBookmark(movie.id)}
            className={cn(
              "mt-6 flex h-11 cursor-pointer items-center gap-2 rounded-lg px-4 text-sm font-semibold",
              isBookmarked ? "bg-ink text-white" : "bg-brand text-white",
            )}
          >
            <BookmarkIcon className="size-4" filled={isBookmarked} />
            즐겨찾기
          </button>
        </div>

        <aside className="w-[330px] shrink-0 border-l border-line pl-10 max-[960px]:w-full max-[960px]:border-l-0 max-[960px]:pl-0">
          <h2 className="text-xl font-bold">내 평점</h2>
          <p className="mt-1 text-sm text-muted">별점은 필수, 후기는 선택이에요.</p>

          <div className="mt-3 flex gap-1.5">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`${value}점`}
                onClick={() => setRating(value)}
                className={cn(
                  "flex size-[42px] cursor-pointer items-center justify-center rounded-lg border border-line bg-white",
                  value <= rating ? "text-yellow-400" : "text-muted",
                )}
              >
                <StarIcon className="size-5" />
              </button>
            ))}
          </div>

          <textarea
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="mt-3 h-[120px] w-full resize-none rounded-lg border border-line bg-white p-3 text-sm outline-none placeholder:text-muted"
          />
          <button
            type="button"
            className="mt-3 h-11 w-full cursor-pointer rounded-lg bg-ink text-sm font-semibold text-white"
          >
            평점 저장
          </button>
        </aside>
      </div>
    </main>
  );
}