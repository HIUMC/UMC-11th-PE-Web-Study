import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return <main className="p-20 text-center">영화를 찾을 수 없어요.</main>;
  }

  return (
    <main>
      <section className="relative h-[360px] w-full overflow-hidden">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0" />
        <div className="relative mx-auto flex h-full  flex-col justify-between px-20 py-6">
          <Link
            to="/"
            className="flex w-fit items-center gap-1 text-sm text-white"
          >
            <span>
              <img
                src="/icons/chevron-left.svg"
                alt=""
                className="h-6 w-6 brightness-0 invert"
              />
            </span>
            영화 목록
          </Link>

          <div className="text-white">
            <h1 className="text-[40px] font-bold">{movie.title}</h1>
            <p className="mt-2 text-xs">{movie.originalTitle}</p>
            <p className="mt-2 text-sm font-bold">
              {movie.releaseDate} · {movie.genres.join(" · ")} · {movie.runtime}
            </p>
          </div>
        </div>
      </section>

      <section className="flex  gap-8 px-20 py-8 justify-between">
        {/* 포스터 */}
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="h-[202px] w-[141px] shrink-0 rounded-lg object-cover shadow-lg"
        />

        {/* 소개 */}
        <div className="flex flex-1 flex-col gap-3">
          <h2 className="text-lg font-bold">{movie.tagline}</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            {movie.overview}
          </p>
          <button
            type="button"
            className="mt-1 flex w-fit cursor-pointer items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white font-extrabold"
          >
            <span>
              <img
                src="/icons/bookmark-outline.svg"
                alt=""
                className="h-6 w-6 brightness-0 invert"
              />
            </span>
            즐겨찾기
          </button>
        </div>

        {/* 내 평점 */}
        <div className="flex w-[294px] shrink-0 flex-col gap-2 border-l border-gray-300 pl-6">
          <h2 className="text-lg font-bold">내 평점</h2>
          <p className="text-[11px] text-gray-500">
            별점은 필수, 후기는 선택이에요.
          </p>

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`${star}점`}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-gray-300 bg-white text-gray-500"
              >
                <img src="/icons/star.svg" className="h-5 w-5" />
              </button>
            ))}
          </div>

          <textarea
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="h-[72px] w-full resize-none rounded-md border border-gray-300 bg-white p-2 text-xs outline-none"
          />
          <button
            type="button"
            className="w-full cursor-pointer rounded-md bg-gray-900 py-2 text-sm font-bold text-white"
          >
            평점 저장
          </button>
        </div>
      </section>
    </main>
  );
}
