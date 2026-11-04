import { Link, useParams } from "@tanstack/react-router";
import { useMovies } from "../../hooks/use-movies";
import MovieRatingForm from "../../components/movies/movie-rating-form";
import { cn } from "../../utils/cn";

export function MovieDetailPage() {
  const { movieId } = useParams({
    from: "/movies/$movieId",
  });
  const { movies, toggleBookmark } = useMovies();

  const movie = movies.find(
    (item) => item.id === Number(movieId),
  );

  if (!movie) {
    return (
      <main className="flex-1 px-6 py-20 text-center">
        <h1 className="mb-6 text-2xl font-bold">
          영화를 찾을 수 없어요.
        </h1>

        <Link
          to="/"
          className="font-semibold text-[#4765df] hover:underline"
        >
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[#f5f6f8]">
      <section className="relative isolate overflow-hidden text-white">
        <img
          src={movie.backdropPath}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />

        <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/75 via-black/35 to-black/10" />

        <div className="mx-auto flex min-h-[360px] max-w-[1328px] flex-col justify-between gap-12 px-6 py-6 sm:min-h-[380px]">
          <Link
            to="/"
            className="inline-flex items-center gap-2 self-start text-sm font-semibold hover:underline"
          >
            <img
              src="/icons/chevron-left.svg"
              alt=""
              className="h-5 w-5 invert"
            />
            영화 목록
          </Link>

          <div>
            <h1 className="max-w-[900px] text-3xl font-extrabold leading-tight tracking-tight sm:text-[40px]">
              {movie.title}
            </h1>

            <p className="mt-3 text-sm text-white/90">
              {movie.originalTitle}
            </p>

            <p className="mt-2 text-sm font-semibold text-white/90">
              {movie.releaseDate}
              {" · "}
              {movie.genres.join(" · ")}
              {" · "}
              {movie.runtime}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1328px] gap-8 px-6 pb-20 pt-6 lg:grid-cols-[200px_minmax(0,1fr)_328px]">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="aspect-[2/3] w-[200px] max-w-full rounded-lg object-cover shadow-lg"
        />

        <section className="min-w-0">
          <h2 className="text-lg font-bold leading-snug">
            {movie.tagline}
          </h2>

          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#6b7280]">
            {movie.overview}
          </p>

          <button
            type="button"
            aria-pressed={movie.isBookmarked}
            onClick={() => toggleBookmark(movie.id)}
            className={cn(
              "mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-3 text-sm font-bold text-white transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4765df]",
              movie.isBookmarked
                ? "bg-[#344fc4] hover:bg-[#2b42a8]"
                : "bg-[#4765df] hover:bg-[#3b56ca]",
            )}
          >
            <img
              src={
                movie.isBookmarked
                  ? "/icons/bookmark.svg"
                  : "/icons/bookmark-outline.svg"
              }
              alt=""
              className="h-4 w-4 invert"
            />
            {movie.isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
          </button>
        </section>

        <MovieRatingForm key={movie.id} />
      </div>
    </main>
  );
}