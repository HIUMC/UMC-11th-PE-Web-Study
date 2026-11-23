"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { movieQueryOptions } from "../../api/movies/movie-query-options";
import MovieRatingForm from "../../components/movies/movie-rating-form";
import MovieImage from "../../components/movies/movie-image";
import RequestMessage from "../../components/movies/request-message";
import QueryStatusNotice from "../../components/movies/query-status-notice";
import { FavoriteButton } from "../../components/movies/favorite-button";
import { toMovieDetail } from "../../utils/movies/movie-adapter";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";

export function MovieDetailPage({ movieId }: { movieId: number }) {
  const movieDetailQuery = useQuery(movieQueryOptions.detail(movieId));
  const movie = movieDetailQuery.data
    ? toMovieDetail(movieDetailQuery.data)
    : undefined;

  function retry() {
    void movieDetailQuery.refetch();
  }

  if (!movie) {
    return (
      <main className="flex-1 bg-[#f5f6f8] px-6">
        {movieDetailQuery.isPending ? (
          <RequestMessage message={movieDetailQuery.isPaused
            ? "네트워크 연결을 기다리고 있어요."
            : "영화 정보를 불러오는 중이에요."} />
        ) : (
          <RequestMessage
            message={getMovieDetailErrorMessage(movieDetailQuery.error)}
            isError
            onRetry={retry}
          />
        )}
        {!movieDetailQuery.isPending && (
          <div className="pb-12 text-center">
            <Link href="/" className="font-semibold text-[#4765df] hover:underline">
              영화 목록으로 돌아가기
            </Link>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[#f5f6f8]">
      <div className="mx-auto max-w-[1328px] px-6">
        <QueryStatusNotice
          isFetching={movieDetailQuery.isFetching}
          isPaused={movieDetailQuery.isPaused}
          hasError={movieDetailQuery.isError}
          onRetry={retry}
        />
      </div>
      <section className="relative isolate overflow-hidden bg-gray-700 text-white">
        <MovieImage
          src={movie.backdropPath}
          alt=""
          sizes="100vw"
          className="absolute inset-0 -z-20 h-full w-full"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/75 via-black/35 to-black/10" />
        <div className="mx-auto flex min-h-[360px] max-w-[1328px] flex-col justify-between gap-12 px-6 py-6 sm:min-h-[380px]">
          <Link href="/" className="inline-flex items-center gap-2 self-start text-sm font-semibold hover:underline">
            <img src="/icons/chevron-left.svg" alt="" className="h-5 w-5 invert" />
            영화 목록
          </Link>
          <div>
            <h1 className="max-w-[900px] text-3xl font-extrabold leading-tight tracking-tight sm:text-[40px]">
              {movie.title}
            </h1>
            <p className="mt-3 text-sm text-white/90">{movie.originalTitle}</p>
            <p className="mt-2 text-sm font-semibold text-white/90">
              {movie.releaseDate || "개봉일 정보 없음"} · {movie.genres.join(", ") || "장르 정보 없음"} · {movie.runtime}
            </p>
          </div>
        </div>
      </section>
      <div className="mx-auto grid max-w-[1328px] gap-8 px-6 pb-20 pt-6 lg:grid-cols-[200px_minmax(0,1fr)_328px]">
        <MovieImage
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          sizes="200px"
          className="aspect-[2/3] w-[200px] max-w-full rounded-lg shadow-lg"
        />
        <section className="min-w-0">
          <h2 className="text-lg font-bold leading-snug">{movie.tagline}</h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#6b7280]">{movie.overview}</p>
          <FavoriteButton movieId={movie.id} />
        </section>
        <MovieRatingForm movieId={movie.id} />
      </div>
    </main>
  );
}
