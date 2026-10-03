import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

const RATING_SCORES = [1, 2, 3, 4, 5];

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="px-20 py-24 text-center text-[#606774]">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  return (
    <main>
      <section className="relative h-[360px] overflow-hidden">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="relative flex h-full flex-col justify-between px-20 py-6 text-white">
          <Link
            to="/"
            className="flex w-fit items-center gap-1 text-[13px] font-bold"
          >
            <img
              src="/icons/chevron-left.svg"
              alt=""
              className="size-6 brightness-0 invert"
            />
            영화 목록
          </Link>
          <div className="flex max-w-[800px] flex-col gap-2">
            <h1 className="text-[46px] font-bold leading-[1.08] tracking-[-2.3px]">
              {movie.title}
            </h1>
            <p className="text-sm">{movie.originalTitle}</p>
            <p className="flex gap-2 text-[13px] font-bold">
              <span>{movie.releaseDate}</span>
              <span>{movie.genres.join(" \u00B7 ")}</span>
              <span>{movie.runtime}</span>
            </p>
          </div>
        </div>
      </section>

      <div className="flex items-start gap-8 px-20 py-6">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="h-[286px] w-[200px] shrink-0 rounded-[10px] object-cover shadow-[0_12px_30px_rgba(12,15,20,0.12)]"
        />

        <section className="flex flex-1 flex-col items-start gap-3">
          <h2 className="text-[21px] font-bold tracking-[-0.63px] text-[#17191e]">
            {movie.tagline}
          </h2>
          <p className="text-sm leading-6 text-[#606774]">{movie.overview}</p>
          <button
            type="button"
            className="flex h-[42px] items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-extrabold text-white"
          >
            <img
              src="/icons/bookmark-outline.svg"
              alt=""
              className="size-4 brightness-0 invert"
            />
            즐겨찾기
          </button>
        </section>

        <aside className="flex w-[360px] shrink-0 flex-col gap-2 border-l border-[#e3e6eb] pb-10 pl-[30px]">
          <h2 className="text-[21px] font-bold tracking-[-0.63px] text-[#17191e]">
            내 평점
          </h2>
          <p className="text-xs text-[#969da8]">
            별점은 필수, 후기는 선택이에요.
          </p>
          <div className="flex gap-1">
            {RATING_SCORES.map((score) => (
              <button
                key={score}
                type="button"
                aria-label={`${score}점`}
                className="flex size-[38px] items-center justify-center rounded-lg border border-[#e3e6eb] bg-white"
              >
                <img src="/icons/star.svg" alt="" className="size-6" />
              </button>
            ))}
          </div>
          <textarea
            aria-label="후기"
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="h-[102px] w-full resize-none rounded-lg border border-[#e3e6eb] bg-white px-3 pb-[18px] pt-4 text-[13px] leading-[19.5px] placeholder:text-[#969da8]"
          />
          <button
            type="button"
            className="h-[42px] w-full rounded-lg bg-[#17191e] text-sm font-extrabold text-white"
          >
            평점 저장
          </button>
        </aside>
      </div>
    </main>
  );
}
