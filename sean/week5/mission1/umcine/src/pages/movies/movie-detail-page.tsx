import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { BookmarkButton } from "../../components/movies/bookmark-button";

function formatRuntime(runtime: number | null) {
  if (runtime === null) return "상영 시간 정보가 없어요.";

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

    setMovie(null);
    setErrorMessage(null);

    if (!isValidMovieId) {
      setErrorMessage("올바르지 않은 영화 번호예요.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    getMovieDetail(parsedMovieId)
      .then((response) => {
        if (!ignore) setMovie(response);
      })
      .catch((error) => {
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [parsedMovieId, isValidMovieId]);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-[1200px] px-6 py-20 text-center">
        <p className="text-lg text-neutral-500">영화 정보를 불러오는 중이에요.</p>
      </main>
    );
  }

  if (errorMessage || !movie) {
    return (
      <main className="mx-auto max-w-[1200px] px-6 py-20 text-center">
        <p className="text-lg text-neutral-500">{errorMessage ?? "영화를 찾을 수 없어요."}</p>
        <Link to="/" className="mt-4 inline-block text-sm text-blue-600">
          영화 목록으로
        </Link>
      </main>
    );
  }

  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const genreNames = movie.genres.map((genre) => genre.name).join(" · ");

  return (
    <main>
      <section className="relative h-[360px]">
        {backdropUrl ? (
          <img
            className="h-full w-full object-cover"
            src={backdropUrl}
            alt=""
            aria-hidden="true"
          />
        ) : (
          <div className="h-full w-full bg-neutral-800" />
        )}
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-black/10" />

        <div className="absolute inset-0 mx-auto flex max-w-[1200px] flex-col px-6 py-6 text-white">
          <Link to="/" className="inline-flex w-fit items-center gap-1 text-sm">
            <img className="h-4 w-4 brightness-0 invert" src="/icons/chevron-left.svg" alt="" />
            영화 목록
          </Link>

          <div className="mt-auto">
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            <p className="mt-1 text-sm text-white/70">{movie.original_title}</p>
            <p className="mt-2 text-sm font-medium">
              {movie.release_date} · {genreNames} · {formatRuntime(movie.runtime)}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-[1200px] gap-10 px-6 pt-8 pb-16">
        <div className="relative z-10 -mt-2 h-[286px] w-[200px] shrink-0 overflow-hidden rounded-lg shadow-lg">
          {posterUrl ? (
            <img
              className="h-full w-full object-cover"
              src={posterUrl}
              alt={`${movie.title} 포스터`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-xs text-neutral-500">
              이미지 없음
            </div>
          )}
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