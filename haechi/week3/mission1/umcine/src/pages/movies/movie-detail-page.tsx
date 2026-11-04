import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <p className="text-lg font-bold">영화를 찾을 수 없어요.</p>
        <Link
          to="/"
          className="rounded-lg bg-ink px-4 py-2 text-sm font-bold text-surface"
        >
          영화 목록으로
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1">
      {/* 배경 이미지 영역 */}
      <section className="relative h-[280px] overflow-hidden bg-ink md:h-[420px]">
        {/* 장식용 배경이라 스크린 리더가 읽지 않도록 비워 둬요. */}
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/40 to-ink/10" />
        <Link
          to="/"
          className="absolute left-4 top-6 flex items-center gap-1 rounded-lg bg-ink/60 px-3 py-2 text-sm font-bold text-surface backdrop-blur-sm md:left-10 xl:left-20"
        >
          <img src="/icons/chevron-left.svg" alt="" width={20} height={20} className="invert" />
          영화 목록
        </Link>
      </section>

      {/* 포스터 + 정보 */}
      <section className="relative -mt-24 flex flex-col gap-6 px-4 pb-16 md:-mt-40 md:flex-row md:gap-10 md:px-10 xl:px-20">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="h-[270px] w-[180px] shrink-0 rounded-[10px] bg-page object-cover shadow-xl md:h-[360px] md:w-60"
        />

        <div className="flex flex-col gap-5 md:pt-44">
          <div className="flex flex-col gap-1">
            <h1 className="text-[38px] font-bold leading-[44px] tracking-[-1.71px]">
              {movie.title}
            </h1>
            <p className="text-base text-ink-secondary">{movie.originalTitle}</p>
          </div>

          <ul className="flex flex-wrap items-center gap-2 text-sm font-bold text-ink-secondary">
            <li>{movie.releaseDate}</li>
            <li aria-hidden="true" className="text-line">|</li>
            <li>{movie.genres.join(" · ")}</li>
            <li aria-hidden="true" className="text-line">|</li>
            <li>{movie.runtime}</li>
          </ul>

          <div className="flex max-w-3xl flex-col gap-2">
            <h2 className="text-xl font-extrabold">{movie.tagline}</h2>
            <p className="text-base leading-7 text-ink-secondary">{movie.overview}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
