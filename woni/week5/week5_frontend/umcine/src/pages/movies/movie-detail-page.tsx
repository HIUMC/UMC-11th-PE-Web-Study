import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { BookmarkButton } from "../../components/bookmark-button";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

const RATING_SCORES = [1, 2, 3, 4, 5];

function formatRuntime(runtime: number | null) {
  if (!runtime) return "상영 시간 정보가 없어요.";

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    setErrorMessage(null);

    if (!isValidMovieId) {
      setMovie(null);
      setIsLoading(false);
      return;
    }

    async function loadMovieDetail() {
      setIsLoading(true);

      try {
        const response = await getMovieDetail(parsedMovieId);
        if (!ignore) setMovie(response);
      } catch (error) {
        if (!ignore) {
          setMovie(null);
          setErrorMessage(getMovieDetailErrorMessage(error));
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovieDetail();

    return () => {
      ignore = true;
    };
  }, [isValidMovieId, parsedMovieId]);

  if (!isValidMovieId) {
    return (
      <main className="px-20 py-24 text-center text-[#606774]">
        올바르지 않은 영화 번호예요.
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="px-20 py-24 text-center text-[#606774]">
        영화 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (errorMessage || !movie) {
    return (
      <main className="px-20 py-24 text-center text-[#606774]">
        {errorMessage ?? "영화를 찾을 수 없어요."}
      </main>
    );
  }

  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <main>
      <section className="relative h-[360px] overflow-hidden bg-gray-600">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <span className="absolute right-6 top-6 text-sm text-gray-300">
            이미지 없음
          </span>
        )}
        <div className="relative flex h-full flex-col justify-between px-20 py-6 text-white">
          <Link
            to="/"
            className="flex w-fit items-center gap-1 text-[13px] font-bold"
          >
            <img
              src="/icons/chevron-left.svg"
              alt=""
              className="size-6 brightness-0 invert"
            />
            영화 목록
          </Link>
          <div className="flex max-w-[800px] flex-col gap-2">
            <h1 className="text-[46px] font-bold leading-[1.08] tracking-[-2.3px]">
              {movie.title}
            </h1>
            <p className="text-sm">{movie.original_title}</p>
            <p className="flex gap-2 text-[13px] font-bold">
              <span>{movie.release_date.replaceAll("-", ".")}</span>
              <span>
                {movie.genres.map((genre) => genre.name).join(" \u00B7 ")}
              </span>
              <span>{formatRuntime(movie.runtime)}</span>
            </p>
          </div>
        </div>
      </section>

      <div className="flex items-start gap-8 px-20 py-6">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${movie.title} 포스터`}
            className="h-[286px] w-[200px] shrink-0 rounded-[10px] object-cover shadow-[0_12px_30px_rgba(12,15,20,0.12)]"
          />
        ) : (
          <div className="flex h-[286px] w-[200px] shrink-0 items-center justify-center rounded-[10px] bg-gray-300 text-sm text-gray-500">
            이미지 없음
          </div>
        )}

        <section className="flex flex-1 flex-col items-start gap-3">
          {movie.tagline && (
            <h2 className="text-[21px] font-bold tracking-[-0.63px] text-[#17191e]">
              {movie.tagline}
            </h2>
          )}
          <p className="text-sm leading-6 text-[#606774]">{movie.overview}</p>
          <BookmarkButton
            movieId={movie.id}
            movieTitle={movie.title}
            variant="text"
          />
        </section>

        <aside className="flex w-[360px] shrink-0 flex-col gap-2 border-l border-[#e3e6eb] pb-10 pl-[30px]">
          <h2 className="text-[21px] font-bold tracking-[-0.63px] text-[#17191e]">
            내 평점
          </h2>
          <p className="text-xs text-[#969da8]">
            별점은 필수, 후기는 선택이에요.
          </p>
          <div className="flex gap-1">
            {RATING_SCORES.map((score) => (
              <button
                key={score}
                type="button"
                aria-label={`${score}점`}
                className="flex size-[38px] items-center justify-center rounded-lg border border-[#e3e6eb] bg-white"
              >
                <img src="/icons/star.svg" alt="" className="size-6" />
              </button>
            ))}
          </div>
          <textarea
            aria-label="후기"
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="h-[102px] w-full resize-none rounded-lg border border-[#e3e6eb] bg-white px-3 pb-[18px] pt-4 text-[13px] leading-[19.5px] placeholder:text-[#969da8]"
          />
          <button
            type="button"
            className="h-[42px] w-full rounded-lg bg-[#17191e] text-sm font-extrabold text-white"
          >
            평점 저장
          </button>
        </aside>
      </div>
    </main>
  );
}
