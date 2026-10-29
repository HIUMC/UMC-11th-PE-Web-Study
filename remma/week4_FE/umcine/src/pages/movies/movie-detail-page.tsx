import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

function formatRuntime(runtime: number | null) {
  if (runtime === null || runtime <= 0) {
    return "상영 시간 정보가 없어요.";
  }
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId =
    Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [rating, setRating] = useState(4);
  const [review, setReview] = useState("");

  // 4주차 Zustand 북마크 store 연결
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(parsedMovieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  useEffect(() => {
    let ignore = false;

    async function loadMovieDetail() {
      if (!isValidMovieId) {
        return;
      }

      await Promise.resolve();
      if (ignore) return;

      setIsLoading(true);
      setErrorMessage(null);

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
  }, [parsedMovieId, isValidMovieId]);

  // 1. 유효하지 않은 영화 ID 처리 (예: /movies/abc, /movies/-1)
  if (!isValidMovieId) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold text-gray-900">
          올바르지 않은 영화 번호예요.
        </p>
        <Link
          to="/"
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  // 2. 로딩 상태
  if (isLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">영화 정보를 불러오는 중이에요.</p>
      </main>
    );
  }

  // 3. 오류 상태 (404: 영화를 찾을 수 없어요. / 기타: 영화 정보를 불러오지 못했어요.)
  if (errorMessage || !movie) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold text-gray-900">
          {errorMessage ?? "영화를 찾을 수 없어요."}
        </p>
        <Link
          to="/"
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const genreText = movie.genres.map((genre) => genre.name).join(", ");
  const runtimeText = formatRuntime(movie.runtime);

  // 4. 성공 상태
  return (
    <main className="flex flex-col">
      {/* 1. 상단 히어로 배너 섹션 */}
      <div className="relative h-[360px] w-full overflow-hidden bg-gray-950 md:h-[400px]">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-70"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-sm text-gray-400">
            이미지 없음
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/50 to-gray-950/30 md:bg-gradient-to-r md:from-gray-950/95 md:via-gray-950/70 md:to-transparent" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-between px-6 py-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            영화 목록
          </Link>

          <div className="pb-4">
            <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
              {movie.title}
            </h1>
            <p className="mt-1.5 text-sm font-medium text-gray-300">
              {movie.original_title}
            </p>
            <p className="mt-2 text-xs font-normal text-gray-300 md:text-sm">
              {movie.release_date}
              {genreText ? ` · ${genreText}` : ""} · {runtimeText}
            </p>
          </div>
        </div>
      </div>

      {/* 2. 하단 상세 정보 및 평점 영역 */}
      <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* 좌측 포스터 */}
          <div className="lg:col-span-3">
            <div className="aspect-[2/3] w-full max-w-[240px] overflow-hidden rounded-2xl bg-gray-200 shadow-md">
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={`${movie.title} 포스터`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                  이미지 없음
                </div>
              )}
            </div>
          </div>

          {/* 중앙 줄거리 및 북마크 버튼 */}
          <div className="flex flex-col lg:col-span-5">
            {movie.tagline && (
              <h2 className="text-lg font-bold text-gray-950">
                {movie.tagline}
              </h2>
            )}
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              {movie.overview || "줄거리 정보가 없어요."}
            </p>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => toggleBookmark(movie.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                  isBookmarked
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50",
                )}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={isBookmarked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                {isBookmarked ? "북마크 해제" : "즐겨찾기"}
              </button>
            </div>
          </div>

          {/* 우측 내 평점 카드 */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-950">내 평점</h3>
              <p className="mt-1 text-xs text-gray-400">
                별점은 필수, 후기는 선택이에요.
              </p>
              <div className="mt-4 flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-0.5 text-xl transition-transform hover:scale-110"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill={star <= rating ? "#3b82f6" : "#e5e7eb"}
                      stroke={star <= rating ? "#3b82f6" : "#e5e7eb"}
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ))}
              </div>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="영화를 보고 느낀 점을 남겨보세요."
                className="mt-4 h-24 w-full resize-none rounded-xl border border-gray-200 p-3 text-sm placeholder-gray-400 outline-none transition-colors focus:border-blue-500"
              />
              <button
                type="button"
                className="mt-4 w-full rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
              >
                평점 저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default MovieDetailPage;