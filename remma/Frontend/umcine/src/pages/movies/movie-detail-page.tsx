import { useState, type SubmitEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { RatingItem } from "../../api/ratings/models";
import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "../../hooks/use-favorite-mutations";
import { useFavoriteStatusQuery } from "../../hooks/use-favorites-query";
import { useMyInfoQuery } from "../../hooks/use-my-info-query";
import {
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useUpdateRatingMutation,
} from "../../hooks/use-rating-mutations";
import { useMemberRatingsQuery } from "../../hooks/use-ratings-query";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

const MAX_COMMENT_LENGTH = 500;

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

function formatDate(dateString?: string) {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={filled ? "#3b82f6" : "#e5e7eb"}
      stroke={filled ? "#3b82f6" : "#e5e7eb"}
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

interface MovieRatingFormProps {
  movieId: number;
  memberId: number;
  existingRating: RatingItem | null;
  onSuccess: (message: string) => void;
  onCancel?: () => void;
}

function MovieRatingForm({
  movieId,
  memberId,
  existingRating,
  onSuccess,
  onCancel,
}: MovieRatingFormProps) {
  const [score, setScore] = useState(existingRating?.score ?? 0);
  const [comment, setComment] = useState(existingRating?.comment ?? "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createRatingMutation = useCreateRatingMutation(memberId, {
    onSuccessMessage: onSuccess,
    onErrorMessage: setErrorMessage,
  });

  const updateRatingMutation = useUpdateRatingMutation(memberId, {
    onSuccessMessage: onSuccess,
    onErrorMessage: setErrorMessage,
  });

  const isPending =
    createRatingMutation.isPending || updateRatingMutation.isPending;
  const canSubmit = score >= 1 && score <= 5 && !isPending;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setErrorMessage(null);
    const trimmedComment = comment.trim();
    const normalizedComment =
      trimmedComment.length > 0 ? trimmedComment : null;

    if (existingRating) {
      updateRatingMutation.mutate({
        ratingId: existingRating.ratingId,
        body: {
          score,
          comment: normalizedComment,
        },
      });
    } else {
      createRatingMutation.mutate({
        movieId,
        score,
        comment: normalizedComment,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
      <fieldset>
        <legend className="text-xs font-semibold text-gray-700">
          별점 선택 (필수)
        </legend>
        <div className="mt-2 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <label
              key={star}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-transform hover:scale-110 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-600"
            >
              <input
                type="radio"
                name="rating-score"
                value={star}
                checked={score === star}
                disabled={isPending}
                onChange={() => setScore(star)}
                className="sr-only"
              />
              <span className="sr-only">{star}점</span>
              <StarIcon filled={star <= score} />
            </label>
          ))}
          <span className="ml-2 text-xs font-semibold text-gray-600">
            {score > 0 ? `${score}점` : "별점을 선택해 주세요"}
          </span>
        </div>
      </fieldset>

      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="movie-rating-comment"
            className="text-xs font-semibold text-gray-700"
          >
            후기 (선택)
          </label>
          <span className="text-xs text-gray-400">
            {comment.length} / {MAX_COMMENT_LENGTH}
          </span>
        </div>
        <textarea
          id="movie-rating-comment"
          name="comment"
          value={comment}
          maxLength={MAX_COMMENT_LENGTH}
          disabled={isPending}
          onChange={(e) => setComment(e.target.value)}
          placeholder="영화를 보고 느낀 점을 남겨보세요."
          className="mt-1.5 min-h-24 w-full resize-y rounded-xl border border-gray-200 p-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-50"
        />
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-600"
        >
          {errorMessage}
        </div>
      )}

      <div className="flex gap-2">
        {onCancel && (
          <button
            type="button"
            disabled={isPending}
            onClick={onCancel}
            className="flex-1 rounded-xl border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-colors",
            canSubmit
              ? "bg-gray-900 hover:bg-black"
              : "cursor-not-allowed bg-gray-300",
          )}
        >
          {isPending
            ? "저장 중..."
            : existingRating
              ? "수정 저장"
              : "평점 저장"}
        </button>
      </div>
    </form>
  );
}

function MovieRatingSection({ movieId }: { movieId: number }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const myInfoQuery = useMyInfoQuery();
  const memberId = myInfoQuery.data?.memberId;
  const memberRatingsQuery = useMemberRatingsQuery(memberId);

  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(
    null,
  );

  const deleteRatingMutation = useDeleteRatingMutation(memberId, {
    onSuccessMessage: (message) => {
      setIsEditing(false);
      setIsConfirmingDelete(false);
      setDeleteErrorMessage(null);
      setStatusMessage(message);
    },
    onErrorMessage: setDeleteErrorMessage,
  });

  if (!accessToken) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-gray-950">내 평점</h3>
        <p className="mt-2 text-sm text-gray-500">
          로그인하면 이 영화에 별점과 후기를 남길 수 있어요.
        </p>
        <Link
          to="/login"
          search={{ redirect: `/movies/${movieId}` }}
          className="mt-4 block w-full rounded-xl bg-blue-600 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          로그인하러 가기
        </Link>
      </div>
    );
  }

  if (myInfoQuery.isLoading || memberRatingsQuery.isLoading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-gray-950">내 평점</h3>
        <p className="mt-4 text-sm text-gray-500">
          내 평점을 불러오는 중이에요.
        </p>
      </div>
    );
  }

  if (myInfoQuery.isError || memberRatingsQuery.isError || memberId === undefined) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-gray-950">내 평점</h3>
        <p className="mt-3 text-sm text-red-600">
          내 평점을 불러오지 못했어요.
        </p>
        <button
          type="button"
          onClick={() => {
            if (myInfoQuery.isError) myInfoQuery.refetch();
            if (memberRatingsQuery.isError) memberRatingsQuery.refetch();
          }}
          className="mt-3 text-sm font-semibold text-blue-600 hover:underline"
        >
          다시 시도하기
        </button>
      </div>
    );
  }

  const existingRating =
    memberRatingsQuery.data?.find((item) => item.movieId === movieId) ?? null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-base font-bold text-gray-950">내 평점</h3>
      <p className="mt-1 text-xs text-gray-400">
        {existingRating && !isEditing
          ? "내가 남긴 별점과 후기예요."
          : "별점은 필수, 후기는 선택이에요."}
      </p>

      {statusMessage && (
        <div
          role="status"
          className="mt-4 rounded-xl bg-blue-50 px-3.5 py-2.5 text-xs font-medium text-blue-700"
        >
          {statusMessage}
        </div>
      )}

      {existingRating && !isEditing ? (
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon key={star} filled={star <= existingRating.score} />
            ))}
            <span className="ml-1.5 text-sm font-bold text-gray-900">
              {existingRating.score} / 5
            </span>
          </div>

          <p className="whitespace-pre-wrap rounded-xl bg-gray-50 p-3.5 text-sm text-gray-700">
            {existingRating.comment || "작성한 후기가 없어요."}
          </p>

          {formatDate(existingRating.updatedAt || existingRating.createdAt) && (
            <p className="text-xs text-gray-400">
              {formatDate(existingRating.updatedAt || existingRating.createdAt)}
            </p>
          )}

          {deleteErrorMessage && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-600"
            >
              {deleteErrorMessage}
            </div>
          )}

          {isConfirmingDelete ? (
            <div className="rounded-xl border border-red-200 bg-red-50/70 p-3.5">
              <p className="text-xs font-semibold text-red-700">
                작성한 평점을 삭제할까요?
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  disabled={deleteRatingMutation.isPending}
                  onClick={() => setIsConfirmingDelete(false)}
                  className="flex-1 rounded-lg border border-gray-300 bg-white py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  disabled={deleteRatingMutation.isPending}
                  onClick={() => {
                    setDeleteErrorMessage(null);
                    deleteRatingMutation.mutate(existingRating.ratingId);
                  }}
                  className="flex-1 rounded-lg bg-red-600 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleteRatingMutation.isPending ? "삭제 중..." : "삭제 확인"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setStatusMessage(null);
                  setDeleteErrorMessage(null);
                  setIsEditing(true);
                }}
                className="flex-1 rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatusMessage(null);
                  setDeleteErrorMessage(null);
                  setIsConfirmingDelete(true);
                }}
                className="flex-1 rounded-xl border border-red-200 bg-white py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      ) : (
        <MovieRatingForm
          key={
            existingRating
              ? `${existingRating.ratingId}-${existingRating.updatedAt}`
              : "new-rating"
          }
          movieId={movieId}
          memberId={memberId}
          existingRating={existingRating}
          onSuccess={(message) => {
            setIsEditing(false);
            setIsConfirmingDelete(false);
            setStatusMessage(message);
          }}
          onCancel={
            existingRating
              ? () => {
                  setIsEditing(false);
                }
              : undefined
          }
        />
      )}
    </div>
  );
}

export function MovieDetailPage() {
  const navigate = useNavigate();
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId =
    Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const accessToken = useAuthStore((state) => state.accessToken);
  const [favoriteErrorMessage, setFavoriteErrorMessage] = useState<
    string | null
  >(null);

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", { movieId: parsedMovieId }],
    queryFn: () => getMovieDetail(parsedMovieId),
    enabled: isValidMovieId,
    staleTime: 30 * 1000,
  });

  // 영화 상세 화면 전용 단건 즐겨찾기 여부 조회 (GET /favorites/{movieId})
  const favoriteStatusQuery = useFavoriteStatusQuery(
    parsedMovieId,
    isValidMovieId,
  );
  const addFavoriteMutation = useAddFavoriteMutation({
    onErrorMessage: setFavoriteErrorMessage,
  });
  const removeFavoriteMutation = useRemoveFavoriteMutation({
    onErrorMessage: setFavoriteErrorMessage,
  });

  // 1. 유효하지 않은 영화 ID 처리 (예: /movies/abc, /movies/-1)
  if (!isValidMovieId) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold text-gray-900">
          올바르지 않은 영화 번호예요.
        </p>
        <Link
          to="/"
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          영화 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  // 2. 로딩 상태
  if (movieDetailQuery.isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">영화 정보를 불러오는 중이에요.</p>
      </div>
    );
  }

  // 3. 오류 상태
  if (movieDetailQuery.isError) {
    const errorMessage = getMovieDetailErrorMessage(movieDetailQuery.error);
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold text-gray-900">{errorMessage}</p>
        <Link
          to="/"
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          영화 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const movie = movieDetailQuery.data;
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const genreText = movie.genres.map((genre) => genre.name).join(", ");
  const runtimeText = formatRuntime(movie.runtime);

  const isFavorite =
    Boolean(accessToken) && (favoriteStatusQuery.data?.isFavorite ?? false);
  const isFavoriteBusy =
    (Boolean(accessToken) && favoriteStatusQuery.isLoading) ||
    addFavoriteMutation.isPending ||
    removeFavoriteMutation.isPending;

  function handleToggleFavorite() {
    if (!accessToken) {
      navigate({
        to: "/login",
        search: { redirect: `/movies/${parsedMovieId}` },
      });
      return;
    }

    if (isFavoriteBusy) return;

    setFavoriteErrorMessage(null);
    if (isFavorite) {
      removeFavoriteMutation.mutate(movie.id);
    } else {
      addFavoriteMutation.mutate({ movieId: movie.id });
    }
  }

  // 4. 성공 상태
  return (
    <div className="flex flex-col">
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
              aria-hidden="true"
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

          {/* 중앙 줄거리 및 서버 즐겨찾기 버튼 */}
          <div className="flex flex-col lg:col-span-5">
            {movie.tagline && (
              <h2 className="text-lg font-bold text-gray-950">
                {movie.tagline}
              </h2>
            )}
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              {movie.overview || "줄거리 정보가 없어요."}
            </p>
            <div className="mt-8 flex flex-col items-start gap-2">
              <button
                type="button"
                aria-pressed={isFavorite}
                disabled={isFavoriteBusy}
                onClick={handleToggleFavorite}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60",
                  isFavorite
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50",
                )}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={isFavorite ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                {Boolean(accessToken) && favoriteStatusQuery.isLoading
                  ? "즐겨찾기 확인 중..."
                  : isFavorite
                    ? "즐겨찾기 해제"
                    : "즐겨찾기"}
              </button>

              {favoriteErrorMessage && (
                <p role="alert" className="text-xs font-medium text-red-600">
                  {favoriteErrorMessage}
                </p>
              )}
            </div>
          </div>

          {/* 우측 내 평점 카드 */}
          <div className="lg:col-span-4">
            <MovieRatingSection movieId={parsedMovieId} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailPage;
