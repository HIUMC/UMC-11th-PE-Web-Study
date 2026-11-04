import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookmarkButton } from "../../components/bookmark-button";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbPosterUrl, getTmdbBackdropUrl } from "../../utils/movies/tmdb-image";
import { MovieImage } from "../../components/movies/movie-image";
import { cn } from "../../utils/cn";

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({ from: "/movies/$movieId" });
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
  });

  if (!isValidMovieId || movieDetailQuery.isPending || movieDetailQuery.isError) {
    const message = !isValidMovieId
      ? "올바르지 않은 영화 번호예요."
      : movieDetailQuery.isPending
        ? "불러오는 중이에요."
        : getMovieDetailErrorMessage(movieDetailQuery.error);

    return (
      <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-8 text-lg font-semibold">
        <p role={isValidMovieId && movieDetailQuery.isPending ? "status" : "alert"}>
          {message}
        </p>
      </main>
    );
  }

  return <MovieDetailContent key={movieId} movie={movieDetailQuery.data} />;
}

function MovieDetailContent({ movie }: { movie: TmdbMovieDetail }) {
  // 영화가 바뀌면 key가 바뀌어 이전 영화에 입력한 평점도 초기화돼요.
  const [rating, setRating] = useState(0);

  const runtime = movie.runtime === null ? "상영 시간 정보가 없어요."
    : `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`;

  return (
    <main className="flex-1 bg-[#f5f6f8]">
      <section className="relative h-[360px] overflow-hidden bg-slate-900 text-white">
        <MovieImage
          src={getTmdbBackdropUrl(movie.backdrop_path)}
          alt=""
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
              {movie.original_title}
            </p>
            <p className="mt-2 text-sm font-semibold">
              {movie.release_date}&nbsp;&nbsp; {movie.genres.map((genre) => genre.name).join(", ")}&nbsp;&nbsp; {runtime}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-8 py-8 lg:grid-cols-[210px_minmax(0,1fr)_330px] lg:px-12">
        <MovieImage
          src={getTmdbPosterUrl(movie.poster_path)}
          alt={`${movie.title} 포스터`}
          className="aspect-[2/3] w-full max-w-[210px] rounded-xl object-cover shadow-xl"
        />

        <div className="min-w-0 pt-1">
          <h2 className="text-2xl font-bold tracking-[-0.03em]">{movie.tagline}</h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-600">
            {movie.overview}
          </p>
          <BookmarkButton movieId={movie.id} variant="detail" />
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
