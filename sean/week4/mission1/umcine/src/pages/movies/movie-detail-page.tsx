import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import { BookmarkButton } from "../../components/movies/bookmark-button";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="mx-auto max-w-[1200px] px-6 py-20 text-center">
        <p className="text-lg text-neutral-500">영화를 찾을 수 없어요.</p>
        <Link to="/" className="mt-4 inline-block text-sm text-blue-600">
          영화 목록으로
        </Link>
      </main>
    );
  }

  return (
    <main>
      <section className="relative h-[360px]">
        <img
          className="h-full w-full object-cover"
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-black/10" />

        <div className="absolute inset-0 mx-auto flex max-w-[1200px] flex-col px-6 py-6 text-white">
          <Link to="/" className="inline-flex w-fit items-center gap-1 text-sm">
            <img className="h-4 w-4 brightness-0 invert" src="/icons/chevron-left.svg" alt="" />
            영화 목록
          </Link>

          <div className="mt-auto">
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            <p className="mt-1 text-sm text-white/70">{movie.originalTitle}</p>
            <p className="mt-2 text-sm font-medium">
              {movie.releaseDate} · {movie.genres.join(" · ")} · {movie.runtime}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-[1200px] gap-10 px-6 pt-8 pb-16">
        <div className="relative z-10 -mt-2 h-[286px] w-[200px] shrink-0 overflow-hidden rounded-lg shadow-lg">
            <img
                className="h-full w-full object-cover"
                src={movie.posterPath}
                alt={`${movie.title} 포스터`}
            />
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold text-neutral-900">{movie.tagline}</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">{movie.overview}</p>

          <BookmarkButton movieId={movie.id} className="mt-5 h-9 px-3 text-sm font-medium">
            즐겨찾기
          </BookmarkButton>
        </div>

        <aside className="w-[300px] shrink-0 border-l border-neutral-200 pl-10">
          <h2 className="text-lg font-bold text-neutral-900">내 평점</h2>
          <p className="mt-1 text-xs text-neutral-500">별점은 필수, 후기는 선택이에요.</p>

          <div className="mt-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((score) => (
              <button key={score} type="button" aria-label={`${score}점`} className="cursor-pointer">
                <img className="h-7 w-7" src="/icons/star.svg" alt="" />
              </button>
            ))}
          </div>

          <textarea
            className="mt-4 h-28 w-full resize-none rounded-md border border-neutral-200 p-3 text-sm"
            placeholder="영화를 보고 느낀 점을 남겨보세요."
          />

          <button
            type="button"
            className="mt-3 w-full cursor-pointer rounded-md bg-neutral-900 py-3 text-sm font-medium text-white"
          >
            평점 저장
          </button>
        </aside>
      </div>
    </main>
  );
}