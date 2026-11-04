import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="grid min-h-[calc(100vh-72px)] place-items-center bg-[#f6f7f9] px-4 text-center">
        <div>
          <h1 className="text-2xl font-bold">영화를 찾을 수 없어요.</h1>
          <Link
            className="mt-5 inline-flex h-10 items-center rounded-[6px] bg-[#4f6ef7] px-5 text-sm font-semibold text-white"
            to="/"
          >
            영화 목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return <MovieDetailContent movie={movie} />;
}

interface MovieDetailContentProps {
  movie: (typeof movies)[number];
}

function MovieDetailContent({ movie }: MovieDetailContentProps) {
  const [isBookmarked, setIsBookmarked] = useState(movie.isBookmarked);

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f6f7f9]">
      <section className="relative h-[360px] overflow-hidden text-white">
        <img
          className="absolute inset-0 size-full object-cover"
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/15" />

        <div className="relative mx-auto flex h-full w-full max-w-[1120px] flex-col px-4 py-8 xl:px-0">
          <Link
            className="inline-flex w-fit items-center gap-1 text-sm text-white/85 hover:text-white"
            to="/"
          >
            <img
              className="size-4 brightness-0 invert"
              src="/icons/movie-icons/chevron-left.svg"
              alt=""
            />
            영화 목록
          </Link>

          <div className="mt-auto pb-2">
            <h1 className="text-[36px] leading-[1.25] font-bold">
              {movie.title}
            </h1>
            <p className="mt-2 text-sm text-white/75">
              {movie.originalTitle}
            </p>
            <p className="mt-2 text-sm text-white/85">
              {movie.releaseDate}
              <span className="mx-2 text-white/45">·</span>
              {movie.genres.join(" · ")}
              <span className="mx-2 text-white/45">·</span>
              {movie.runtime}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-4 py-10 md:flex-row xl:px-0">
        <img
          className="mx-auto aspect-[2/3] w-[220px] shrink-0 rounded-lg object-cover shadow-lg md:mx-0"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
        />

        <div className="min-w-0 flex-1 py-2">
          <h2 className="text-2xl leading-[1.4] font-bold">
            {movie.tagline}
          </h2>
          <p className="mt-5 max-w-[760px] text-[15px] leading-7 text-[#5f6066]">
            {movie.overview}
          </p>

          <button
            type="button"
            className={cn(
              "mt-8 inline-flex h-11 items-center gap-2 rounded-[6px] px-5 text-sm font-semibold",
              isBookmarked
                ? "bg-[#304fd6] text-white"
                : "bg-[#4f6ef7] text-white",
            )}
            aria-pressed={isBookmarked}
            onClick={() => setIsBookmarked((current) => !current)}
          >
            <img
              className="size-5 brightness-0 invert"
              src={
                isBookmarked
                  ? "/icons/movie-icons/bookmark.svg"
                  : "/icons/movie-icons/bookmark-outline.svg"
              }
              alt=""
            />
            {isBookmarked ? "북마크 해제" : "북마크"}
          </button>
        </div>
      </section>
    </main>
  );
}
