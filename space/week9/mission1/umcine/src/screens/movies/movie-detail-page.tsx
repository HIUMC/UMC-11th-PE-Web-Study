"use client";

import { MovieRating } from "../../components/movie-rating";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { BookmarkButton } from "../../components/bookmark-button";
import { getMovieDetailErrorMessage } from "../../utils/movies/movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams<{ movieId: string }>();
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
  });

  if (!isValidMovieId) {
    return (
      <main className="p-6 text-sm text-text-secondary" role="alert">
        올바르지 않은 영화 번호예요.
      </main>
    );
  }

  if (movieDetailQuery.isPending) {
    return (
      <main className="p-6 text-sm text-text-secondary" role="status">
        영화 상세 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (movieDetailQuery.isError) {
    return (
      <main className="p-6 text-sm text-text-secondary" role="alert">
        {getMovieDetailErrorMessage(movieDetailQuery.error)}
      </main>
    );
  }

  return <MovieDetailContent movie={movieDetailQuery.data} />;
}

function MovieDetailContent({ movie }: { movie: TmdbMovieDetail }) {
  const runtime =
    movie.runtime === null
      ? "상영시간 미정"
      : `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`;

  return (
    <main className="w-full">
      <section className="relative isolate flex min-h-96 w-full flex-col justify-between overflow-hidden">
        {movie.backdrop_path && (
          <img
            src={getTmdbBackdropUrl(movie.backdrop_path) ?? ""}
            className="absolute inset-0 size-full object-cover"
            alt=""
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
        <div className="relative flex flex-1 flex-col justify-between gap-10 px-4 py-5 sm:px-6 sm:py-6 lg:px-10 xl:px-20">
          <Link
            className="inline-flex items-center gap-1 self-start"
            href="/"
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
              {movie.original_title}
            </p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-white">
              <span>{movie.release_date || "개봉일 미정"}</span>
              <span aria-hidden="true">·</span>
              <span>{movie.genres.map((genre) => genre.name).join(" · ")}</span>
              <span aria-hidden="true">·</span>
              <span>{runtime}</span>
            </div>
          </div>
        </div>
      </section>
      <section className="grid w-full grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:px-10 xl:grid-cols-[12rem_minmax(0,1fr)_24rem] xl:gap-8 xl:px-20">
          <div className="mx-auto aspect-[2/3] w-36 overflow-hidden rounded-lg bg-bg-page shadow-[0px_12px_30px_0px_rgba(12,15,20,0.12)] sm:w-40 xl:mx-0 xl:w-48">
            <img
              className="size-full object-cover"
              src={getTmdbPosterUrl(movie.poster_path) ?? ""}
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
            <MovieRating movieId={movie.id} />
          </section>
      </section>
    </main>
  );
}
