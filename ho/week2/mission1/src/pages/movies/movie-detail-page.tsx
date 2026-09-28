import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));
  const [isBookmarked, setIsBookmarked] = useState(movie?.isBookmarked ?? false);
  const [rating, setRating] = useState(0);

  if (!movie) {
    return (
      <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-8 text-lg font-semibold">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[#f5f6f8]">
      <section className="relative h-[360px] overflow-hidden bg-slate-900 text-white">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/10" />
        <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col justify-between px-8 py-8 lg:px-12">
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/90 hover:text-white"
          >
            <span aria-hidden="true">‹</span> 영화 목록
          </Link>
          <div className="pb-2 drop-shadow-lg">
            <h1 className="text-4xl font-extrabold tracking-[-0.04em] lg:text-5xl">
              {movie.title}
            </h1>
            <p className="mt-4 text-sm font-medium text-white/90">
              {movie.originalTitle}
            </p>
            <p className="mt-2 text-sm font-semibold">
              {movie.releaseDate}&nbsp;&nbsp; {movie.genres.join(" · ")}&nbsp;&nbsp; {movie.runtime}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-8 py-8 lg:grid-cols-[210px_minmax(0,1fr)_330px] lg:px-12">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="w-full max-w-[210px] rounded-xl object-cover shadow-xl"
        />

        <div className="min-w-0 pt-1">
          <h2 className="text-2xl font-bold tracking-[-0.03em]">{movie.tagline}</h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-600">
            {movie.overview}
          </p>
          <button
            type="button"
            onClick={() => setIsBookmarked((value) => !value)}
            className={cn(
              "mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-bold text-white transition-colors hover:bg-blue-700",
              isBookmarked && "bg-slate-900 hover:bg-slate-700",
            )}
          >
            <img
              src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
              alt=""
              className="size-5 brightness-0 invert"
            />
            {isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
          </button>
        </div>

        <aside className="border-l border-slate-200 pl-8">
          <h2 className="text-xl font-bold">내 평점</h2>
          <p className="mt-1 text-xs text-slate-400">별점을 고른 후, 간단한 리뷰예요.</p>
          <div className="mt-3 flex gap-2" aria-label="평점 선택">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`${value}점`}
                aria-pressed={rating >= value}
                onClick={() => setRating(value)}
                className={cn(
                  "flex size-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition-colors hover:border-blue-400",
                  rating >= value && "border-blue-600 bg-blue-50 text-blue-600",
                )}
              >
                <img
                  src={rating >= value ? "/icons/star.svg" : "/icons/star-outline.svg"}
                  alt=""
                  className="size-5"
                />
              </button>
            ))}
          </div>
          <textarea
            aria-label="영화 리뷰"
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="mt-3 h-24 w-full resize-none rounded-lg border border-slate-200 bg-white p-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500"
          />
          <button
            type="button"
            className="mt-2 h-11 w-full rounded-lg bg-[#17191d] text-sm font-bold text-white transition-colors hover:bg-slate-700"
          >
            평점 저장
          </button>
        </aside>
      </section>
    </main>
  );
}
