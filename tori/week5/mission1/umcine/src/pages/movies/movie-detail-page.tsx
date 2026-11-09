import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";

import { getTmdbPosterUrl, getTmdbBackdropUrl } from "../../utils/movies/tmdb-image";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";

import { cn } from "../../utils/cn";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });

  const numericMovieId = Number(movieId);

  // TMDB 영화 상세 데이터
  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);

  // API 요청 상태
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 기존 북마크 기능
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(numericMovieId),
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  // 기존 별점 및 리뷰 기능
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");

  // TMDB 상세 정보 요청
  useEffect(() => {
    let ignore = false;

    setMovie(null);
    setErrorMessage(null);

    // 올바르지 않은 영화 ID 검사
    if (!Number.isInteger(numericMovieId) || numericMovieId <= 0) {
      setIsLoading(false);
      setErrorMessage("올바르지 않은 영화 번호예요.");
      return;
    }

    async function loadMovieDetail() {
      setIsLoading(true);

      try {
        const response = await getMovieDetail(numericMovieId);

        if (!ignore) {
          setMovie(response);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(getMovieDetailErrorMessage(error));
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadMovieDetail();

    return () => {
      ignore = true;
    };
  }, [numericMovieId]);

  // 로딩 상태
  if (isLoading) {
    return (
      <main className="py-24 text-center text-text-sub">
        영화 정보를 불러오는 중이에요.
      </main>
    );
  }

  // 오류 상태
  if (errorMessage) {
    return (
      <main className="py-24 text-center text-text-sub">
        {errorMessage}
      </main>
    );
  }

  // 영화 데이터가 없는 경우
  if (!movie) {
    return (
      <main className="py-24 text-center text-text-sub">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  // TMDB 이미지 URL 변환
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

  // 장르 이름 연결
  const genres = movie.genres.map((genre) => genre.name).join(" · ");

  // 상영 시간 변환
  const runtime =
    movie.runtime !== null
      ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
      : "상영 시간 정보가 없어요.";

  function handleSubmitReview() {
    setReview("");
    setRating(0);
  }

  return (
    <main>
      {/* 영화 배경 이미지 */}
      <div className="relative h-[360px] w-full overflow-hidden bg-gray-300">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
            이미지 없음
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <Link
          to="/"
          className="absolute left-6 top-6 flex items-center gap-1 text-sm font-semibold text-white"
        >
          <img
            src="/icons/chevron-left.svg"
            alt=""
            className="h-4 w-4 invert"
          />
          영화 목록
        </Link>

        <div className="absolute bottom-6 left-0 w-full px-6">
          <div className="mx-auto max-w-[1280px]">
            <h1 className="text-3xl font-bold text-white">
              {movie.title}
            </h1>
          </div>
        </div>
      </div>

      {/* 영화 상세 정보 */}
      <div className="mx-auto grid max-w-[1280px] grid-cols-[auto_1fr_320px] gap-8 px-6 py-8">

        {/* 포스터 */}
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${movie.title} 포스터`}
            className="h-[240px] w-[160px] shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-[240px] w-[160px] shrink-0 items-center justify-center rounded-lg bg-gray-300 text-sm text-gray-500">
            이미지 없음
          </div>
        )}

        {/* 영화 정보 */}
        <div className="min-w-0">
          <p className="text-sm text-text-muted">
            {movie.original_title}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-text-sub">
            <span>{movie.release_date}</span>
            <span>·</span>
            <span>{genres}</span>
            <span>·</span>
            <span>{runtime}</span>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-surface p-4">
            <p className="font-bold">{movie.tagline}</p>
            <p className="mt-2 text-sm text-text-sub">
              {movie.overview}
            </p>
          </div>

          {/* 북마크 버튼 */}
          <button
            type="button"
            onClick={() => toggleBookmark(movie.id)}
            aria-pressed={isBookmarked}
            className={cn(
              "mt-4 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold",
              isBookmarked
                ? "border-primary bg-primary text-white"
                : "border-border bg-surface text-text",
            )}
          >
            <img
              src={
                isBookmarked
                  ? "/icons/bookmark.svg"
                  : "/icons/bookmark-outline.svg"
              }
              alt=""
              className={cn(
                "h-4 w-4",
                isBookmarked && "brightness-0 invert",
              )}
            />

            {isBookmarked ? "북마크됨" : "북마크"}
          </button>
        </div>

        {/* 별점 및 리뷰 */}
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="font-bold">내 평점</p>

          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`${star}점`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="text-2xl leading-none"
              >
                <span
                  className={
                    star <= (hoverRating || rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                >
                  ★
                </span>
              </button>
            ))}
          </div>

          <textarea
            value={review}
            onChange={(event) => setReview(event.target.value)}
            placeholder="영화에 대한 감상평을 남겨주세요."
            rows={4}
            className="mt-3 w-full resize-none rounded-lg border border-border bg-bg p-3 text-sm outline-none focus:border-primary"
          />

          <button
            type="button"
            onClick={handleSubmitReview}
            className="mt-3 w-full rounded-lg bg-gray-900 py-2 text-sm font-semibold text-white"
          >
            평점 저장
          </button>
        </div>
      </div>
    </main>
  );
}