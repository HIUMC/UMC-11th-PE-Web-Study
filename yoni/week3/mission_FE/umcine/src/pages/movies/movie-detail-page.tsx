import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });

  const movie = movies.find((movie) => movie.id === Number(movieId));

  if (!movie) {
    return (
      <main className="mx-auto max-w-[1120px] px-6 py-10">
        <p className="text-lg font-semibold">영화를 찾을 수 없어요.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <section className="relative h-[330px] overflow-hidden">
        <img
          src={movie.backdropPath}
          alt={`${movie.title} 배경`}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 mx-auto flex max-w-[1120px] flex-col justify-between px-10 py-6 text-white">
          <Link to="/" className="w-fit text-[12px] font-medium text-white/90">
            ← 영화 목록
          </Link>

          <div className="pb-4">
            <h1 className="text-[30px] leading-tight font-bold">
              {movie.title}
            </h1>

            <p className="mt-2 text-[12px] text-white/90">
              {movie.originalTitle}
            </p>

            <p className="mt-1 text-[12px] text-white/90">
              {movie.releaseDate} · {movie.genres.join(" · ")} · {movie.runtime}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1120px] grid-cols-[176px_1fr_300px] gap-7 px-10 py-6">
        <div>
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="w-full rounded-lg object-cover shadow-md"
          />
        </div>

        <div className="pt-1 pr-6">
          <h2 className="text-[18px] font-bold text-[#1f1f1f]">
            {movie.tagline}
          </h2>

          <p className="mt-4 text-[13px] leading-6 text-[#6b7280]">
            {movie.overview}
          </p>

          <button
            type="button"
            className="mt-6 rounded-md bg-[#2563eb] px-5 py-2.5 text-[13px] font-semibold text-white"
          >
            ♡ 즐겨찾기
          </button>
        </div>

        <aside className="border-l border-[#e5e7eb] pl-7">
          <h2 className="text-[18px] font-bold text-[#1f1f1f]">내 평점</h2>

          <p className="mt-1 text-[11px] text-[#9ca3af]">
            별점을 남기고 후기를 남겨보세요.
          </p>

          <div className="mt-5 flex gap-2">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-[#d1d5db] bg-white text-[18px] text-[#6b7280]"
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="mt-5 h-[96px] w-full resize-none rounded-md border border-[#d1d5db] bg-white p-3 text-[12px] outline-none"
          />

          <button
            type="button"
            className="mt-4 h-10 w-full rounded-md bg-[#1f2329] text-[13px] font-semibold text-white"
          >
            평점 저장
          </button>
        </aside>
      </section>
    </main>
  );
}
