import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));
  const [isBookmarked, setIsBookmarked] = useState(movie?.isBookmarked ?? false);

  if (!movie) {
    return (
      <main className="grid flex-1 place-items-center bg-[#f6f8fb] px-6 py-24 text-center">
        <div>
          <p className="text-sm font-bold text-blue-600">Movie not found</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            영화를 찾을 수 없어요.
          </h1>
          <Link
            className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200"
            to="/"
          >
            영화 목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-white">
      <section className="relative isolate min-h-80 overflow-hidden sm:min-h-96">
        <img
          className="absolute inset-0 -z-20 size-full object-cover object-center"
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-slate-950 via-slate-950/55 to-slate-950/25" />
        <div className="mx-auto flex min-h-80 max-w-320 flex-col justify-end px-5 py-10 text-center text-white sm:min-h-96 sm:px-8 sm:py-14">
          <h1 className="text-3xl font-black tracking-[-0.045em] drop-shadow-lg sm:text-5xl">
            {movie.title}
          </h1>
          <p className="mt-3 text-sm font-medium text-white/75">
            {movie.originalTitle}
          </p>
          <p className="mt-2 text-xs font-semibold text-white/70 sm:text-sm">
            {movie.releaseDate}
            <span className="mx-2 text-white/35">·</span>
            {movie.genres.join(" · ")}
            <span className="mx-2 text-white/35">·</span>
            {movie.runtime}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[260px_1fr] md:gap-12 md:py-14">
        <div>
          <img
            className="mx-auto aspect-[4/5] w-full max-w-65 rounded-2xl object-cover shadow-xl shadow-slate-900/15 md:mx-0"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </div>
        <div className="self-center">
          <Link
            className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200"
            to="/"
          >
            <img
              className="size-4 rotate-180 opacity-60"
              src="/icons/arrow-right.svg"
              alt=""
            />
            영화 목록
          </Link>
          <h2 className="mt-6 text-2xl font-extrabold tracking-[-0.035em] text-slate-900 sm:text-3xl">
            {movie.tagline}
          </h2>
          <p className="mt-5 text-[15px] leading-7 text-slate-600">
            {movie.overview}
          </p>
          <dl className="mt-7 grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-5 text-sm sm:grid-cols-3">
            <div>
              <dt className="font-semibold text-slate-400">개봉일</dt>
              <dd className="mt-1 font-bold text-slate-800">
                {movie.releaseDate}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-400">장르</dt>
              <dd className="mt-1 font-bold text-slate-800">
                {movie.genres.join(", ")}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-400">상영 시간</dt>
              <dd className="mt-1 font-bold text-slate-800">{movie.runtime}</dd>
            </div>
          </dl>
          <button
            className={cn(
              "mt-7 inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg px-5 text-sm font-bold text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200",
              isBookmarked
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-slate-900 hover:bg-slate-800",
            )}
            type="button"
            aria-pressed={isBookmarked}
            onClick={() => setIsBookmarked((current) => !current)}
          >
            <img
              className="size-5 invert"
              src={
                isBookmarked
                  ? "/icons/bookmark.svg"
                  : "/icons/bookmark-outline.svg"
              }
              alt=""
            />
            {isBookmarked ? "북마크 해제" : "즐겨찾기"}
          </button>
        </div>
      </section>
    </main>
  );
}
