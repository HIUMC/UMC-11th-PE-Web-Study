import { Link, useParams } from "@tanstack/react-router";
import { initialMovies as movies } from "../../data/movies";
import { BookmarkButton } from "../../components/bookmark-button";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return <main>영화를 찾을 수 없어요.</main>;
  }

  return (
    <main className="w-full">
      <section className="relative isolate flex min-h-96 w-full flex-col justify-between overflow-hidden">
        <img
          src={movie.backdropPath}
          className="absolute inset-0 size-full object-cover"
          alt=""
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
        <div className="relative flex flex-1 flex-col justify-between gap-10 px-4 py-5 sm:px-6 sm:py-6 lg:px-10 xl:px-20">
          <Link
            className="inline-flex items-center gap-1 self-start"
            to="/"
          >
            <img
              className="size-6 brightness-0 invert"
              src="/icons/chevron-left.svg"
              alt=""
              aria-hidden="true"
            />
            <span className="text-xs font-bold text-white">영화 목록</span>
          </Link>
          <div className="flex w-full max-w-3xl flex-col items-start gap-2">
            <h1 className="text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl">
              {movie.title}
            </h1>
            <p className="text-sm font-normal text-white">
              {movie.originalTitle}
            </p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-white">
              <span>{movie.releaseDate}</span>
              <span aria-hidden="true">·</span>
              <span>{movie.genres.join(" · ")}</span>
              <span aria-hidden="true">·</span>
              <span>{movie.runtime}</span>
            </div>
          </div>
        </div>
      </section>
      <section className="grid w-full grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:px-10 xl:grid-cols-[12rem_minmax(0,1fr)_24rem] xl:gap-8 xl:px-20">
          <div className="mx-auto aspect-[2/3] w-36 overflow-hidden rounded-lg bg-bg-page shadow-[0px_12px_30px_0px_rgba(12,15,20,0.12)] sm:w-40 xl:mx-0 xl:w-48">
            <img
              className="size-full object-cover"
              src={movie.posterPath}
              alt={`${movie.title} 포스터`}
            />
          </div>
          <div className="flex min-w-0 flex-col items-start gap-3">
            <h2 className="text-xl font-bold text-text-primary">
              {movie.tagline}
            </h2>
            <p className="text-sm leading-6 text-text-secondary">
              {movie.overview}
            </p>
            <BookmarkButton movieId={movie.id} variant="action" />
          </div>
          <section className="flex w-full flex-col items-start gap-2 border-t border-border-default pt-5 xl:border-t-0 xl:border-l xl:pt-0 xl:pb-10 xl:pl-7">
            <h2 className="text-xl font-bold text-text-primary">내 평점</h2>
            <p className="text-xs text-text-tertiary">
              별점은 필수, 후기는 선택이에요.
            </p>
            <div className="inline-flex items-start gap-1">
              <div className="size-9 px-1.5 py-px bg-bg-surface rounded-lg outline outline-1 outline-offset-[-1px] outline-border-default inline-flex flex-col justify-center items-center">
                <div className="size-6 relative overflow-hidden">
                  <img className="size-5" src="/icons/star.svg" alt="" aria-hidden="true" />
                </div>
              </div>
              <div className="size-9 px-1.5 py-px bg-bg-surface rounded-lg outline outline-1 outline-offset-[-1px] outline-border-default inline-flex flex-col justify-center items-center">
                <div className="size-6 relative overflow-hidden">
                  <img className="size-5" src="/icons/star.svg" alt="" aria-hidden="true" />
                </div>
              </div>
              <div className="size-9 px-1.5 py-px bg-bg-surface rounded-lg outline outline-1 outline-offset-[-1px] outline-border-default inline-flex flex-col justify-center items-center">
                <div className="size-6 relative overflow-hidden">
                  <img className="size-5" src="/icons/star.svg" alt="" aria-hidden="true" />
                </div>
              </div>
              <div className="size-9 px-1.5 py-px bg-bg-surface rounded-lg outline outline-1 outline-offset-[-1px] outline-border-default inline-flex flex-col justify-center items-center">
                <div className="size-6 relative overflow-hidden">
                  <img className="size-5" src="/icons/star.svg" alt="" aria-hidden="true" />
                </div>
              </div>
              <div className="size-9 px-1.5 py-px bg-bg-surface rounded-lg outline outline-1 outline-offset-[-1px] outline-border-default inline-flex flex-col justify-center items-center">
                <div className="size-6 relative overflow-hidden">
                  <img className="size-5" src="/icons/star.svg" alt="" aria-hidden="true" />
                </div>
              </div>
            </div>
            <div className="min-h-24 w-full px-3 py-4 bg-bg-surface rounded-lg outline outline-1 outline-offset-[-1px] outline-border-default">
              <div className="flex-1 inline-flex flex-col justify-start items-start">
                <div className="self-stretch justify-center text-text-tertiary text-xs font-normal font-['Pretendard'] leading-5">
                  영화를 보고 느낀 점을 남겨보세요.
                </div>
              </div>
            </div>
            <div className="h-10 w-full px-4 bg-text-primary rounded-lg outline outline-1 outline-offset-[-1px] outline-bg-surface inline-flex justify-center items-center">
              <div className="text-center justify-center text-bg-surface text-sm font-extrabold font-['Pretendard']">
                평점 저장
              </div>
            </div>
          </section>
      </section>
    </main>
  );
}
