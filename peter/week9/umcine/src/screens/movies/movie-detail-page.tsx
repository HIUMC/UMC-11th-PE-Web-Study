"use client";

import { useState } from "react";
import Link from "next/link";
import { movieDetailQueryOptions } from "../../api/movies/movie-query-options";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTmdbPosterUrl,
  getTmdbBackdropUrl,
} from "../../utils/movies/tmdb-image";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { cn } from "../../utils/cn";
import { BookmarkButton } from "../../components/bookmark-button";
import { useAuthStore } from "@/stores/auth-store";
import { getMemberId } from "@/utils/get-member-id";
import { getMemberRatings } from "@/api/ratings/get-member-ratings";
import { createRating } from "@/api/ratings/create-rating";
import { updateRating } from "@/api/ratings/update-rating";
import { deleteRating } from "@/api/ratings/delete-rating";
import type { Rating } from "@/api/ratings/get-member-ratings";

interface RatingDraft {
  score: number;
  comment: string;
}

interface SaveRatingVariables extends RatingDraft {
  memberId: number;
  movieId: number;
  ratingId?: number;
}

interface DeleteRatingVariables {
  memberId: number;
  movieId: number;
  ratingId: number;
}

export function MovieDetailPage({ movieId }: { movieId: string }) {
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isSafeInteger(parsedMovieId) && parsedMovieId > 0;
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getMemberId(accessToken);
  const queryClient = useQueryClient();
  const [drafts, setDrafts] = useState<Record<string, RatingDraft>>({});

  const ratingsQuery = useQuery({
    queryKey: ["ratings", "member", memberId],
    queryFn: () => {
      if (memberId === null) {
        throw new Error("회원 ID를 확인할 수 없어요.");
      }

      return getMemberRatings(memberId);
    },
    enabled: memberId !== null && isValidMovieId,
    retry: false,
  });

  const savedRating = ratingsQuery.data?.find(
    (item) => item.movieId === parsedMovieId,
  );
  const draftKey = `${memberId}:${parsedMovieId}`;
  const draft = drafts[draftKey];
  const rating = draft?.score ?? savedRating?.score ?? 0;
  const comment = draft?.comment ?? savedRating?.comment ?? "";

  function clearDraft(ownerId: number, targetMovieId: number) {
    setDrafts((previous) => {
      const next = { ...previous };
      delete next[`${ownerId}:${targetMovieId}`];
      return next;
    });
  }

  const saveRatingMutation = useMutation({
    mutationFn: ({ ratingId, movieId, score, comment }: SaveRatingVariables) => {
      const body = { score, comment };
      if (ratingId !== undefined) {
        return updateRating(ratingId, body);
      }

      return createRating({ movieId, ...body });
    },
    onMutate: (variables) =>
      queryClient.cancelQueries({
        queryKey: ["ratings", "member", variables.memberId],
        exact: true,
      }),
    onSuccess: (response, variables) => {
      queryClient.setQueryData<Rating[]>(
        ["ratings", "member", variables.memberId],
        (previous = []) => {
          const exists = previous.some(
            (item) => item.ratingId === response.ratingId,
          );
          return exists
            ? previous.map((item) =>
                item.ratingId === response.ratingId ? response : item,
              )
            : [response, ...previous];
        },
      );
      clearDraft(variables.memberId, variables.movieId);
      alert("평점이 저장됐어요.");
    },
    onError: () => {
      alert("평점 저장에 실패했어요. 다시 시도해 주세요.");
    },
  });

  const deleteRatingMutation = useMutation({
    mutationFn: ({ ratingId }: DeleteRatingVariables) => deleteRating(ratingId),
    onMutate: (variables) =>
      queryClient.cancelQueries({
        queryKey: ["ratings", "member", variables.memberId],
        exact: true,
      }),
    onSuccess: (_response, variables) => {
      queryClient.setQueryData<Rating[]>(
        ["ratings", "member", variables.memberId],
        (previous = []) => previous.filter(
          (item) => item.ratingId !== variables.ratingId,
        ),
      );
      clearDraft(variables.memberId, variables.movieId);
      alert("평점이 삭제됐어요.");
    },
    onError: () => {
      alert("평점 삭제에 실패했어요. 다시 시도해 주세요.");
    },
  });

  const canEditRating =
    memberId !== null &&
    isValidMovieId &&
    ratingsQuery.isSuccess &&
    !ratingsQuery.isFetching &&
    !saveRatingMutation.isPending &&
    !deleteRatingMutation.isPending;

  const movieDetailQuery = useQuery(movieDetailQueryOptions(parsedMovieId));
  const movie = movieDetailQuery.data;

  function handleRatingClick(score: number) {
    if (!canEditRating) return;
    setDrafts((previous) => ({
      ...previous,
      [draftKey]: { score, comment },
    }));
  }

  function handleChangeComment(value: string) {
    if (!canEditRating) return;
    setDrafts((previous) => ({
      ...previous,
      [draftKey]: { score: rating, comment: value },
    }));
  }

  function handleSaveRating() {
    if (!canEditRating || memberId === null) return;
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      alert("별점을 1점부터 5점 사이에서 선택해 주세요.");
      return;
    }
    if (comment.length > 500) {
      alert("후기는 500자 이하로 입력해 주세요.");
      return;
    }
    saveRatingMutation.mutate({
      memberId,
      movieId: parsedMovieId,
      ratingId: savedRating?.ratingId,
      score: rating,
      comment,
    });
  }

  function handleDeleteRating() {
    if (!canEditRating || memberId === null || !savedRating) return;
    deleteRatingMutation.mutate({
      memberId,
      movieId: parsedMovieId,
      ratingId: savedRating.ratingId,
    });
  }

  if (!isValidMovieId) {
    return <main>올바르지 않은 영화 번호예요.</main>;
  }
  if (movieDetailQuery.isPending) {
    return <main role="status">영화 정보를 불러오는 중이에요.</main>;
  }
  if (movieDetailQuery.isError) {
    return (
      <main role="alert">
        {getMovieDetailErrorMessage(movieDetailQuery.error)}
      </main>
    );
  }
  if (!movie) {
    return <main>영화를 찾을 수 없어요.</main>;
  }

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const runtimeText = typeof movie.runtime === "number"
    ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
    : "상영 시간 정보가 없어요.";
    
  return (
    <main>
      <section className="relative mx-auto h-[360px] w-full max-w-[1440px] overflow-hidden">
       {backdropUrl ? (
        <img
          src={backdropUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-gray-600 text-white">
          이미지 없음
        </div>
      )}

        <div className="absolute inset-0 flex h-full w-full flex-col justify-between px-6 py-6 text-white sm:px-10 xl:px-20">
          <Link
            href="/"
            className="flex h-6 w-[76px] items-center gap-1 text-white no-underline"
          >
            <span className="relative h-6 w-6 shrink-0" aria-hidden="true">
              <svg
                viewBox="0 0 6 12"
                fill="none"
                className="absolute top-1.5 left-[9px] h-3 w-1.5"
              >
                <path
                  d="M5 1L1 6L5 11"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="flex h-4 w-12 shrink-0 items-center justify-center text-center text-[13px] leading-none font-bold whitespace-nowrap text-white">
              영화 목록
            </span>
          </Link>

          <div className="flex h-[99px] w-full max-w-[800px] flex-col gap-2">
            <h1 className="h-[50px] w-full text-[46px] leading-[49.68px] font-bold tracking-[-2.3px] text-white">
              {movie.title}
            </h1>

            <div className="h-[17px] w-full text-sm leading-none font-normal text-white">
              {movie.original_title}
            </div>

            <div className="flex h-4 w-full items-center gap-2 text-[13px] leading-none font-bold text-white">
              <span className="min-w-[70px] shrink-0 whitespace-nowrap">
                {movie.release_date}
              </span>
              <span>·</span>
              <span className="min-w-[80px] shrink-0 whitespace-nowrap">
                {movie.genres.map((genre) => genre.name).join(" · ")}
              </span>
              <span>·</span>
              <span className="min-w-[61px] shrink-0 whitespace-nowrap">
                {runtimeText}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto box-border flex h-auto w-full max-w-[1440px] flex-col items-start gap-8 px-6 py-6 sm:px-10 xl:flex-row xl:px-20">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${movie.title} 포스터`}
            className="h-[286px] w-[200px] shrink-0 rounded-[10px] bg-[#f6f7f9] object-cover shadow-[0px_12px_30px_0px_#0C0F141F]"
          />
        ) : (
          <div className="flex h-[286px] w-[200px] shrink-0 items-center justify-center rounded-[10px] bg-[#f6f7f9] text-sm text-[#606774]">
            이미지 없음
          </div>
        )}

        <section className="flex w-full max-w-[656px] flex-col gap-3 xl:min-w-0 xl:flex-1">
          <h2 className="h-[25px] w-full text-[21px] leading-none font-bold tracking-[-0.63px] text-[#17191e]">
            {movie.tagline}
          </h2>

          <p className="w-full text-sm leading-6 font-normal text-[#606774]">
            {movie.overview}
          </p>

          <BookmarkButton movieId={movie.id} variant="detail" />

        </section>

        <aside className="box-border flex w-full max-w-[360px] shrink-0 flex-col gap-2 border-l border-[#e3e6eb] pb-[41px] pl-[30px]">
          <h2 className="h-[25px] w-full text-[21px] leading-none font-bold tracking-[-0.63px] text-[#17191e]">
            내 평점
          </h2>
          {!accessToken ? (
            <p>로그인하면 내 평점을 확인할 수 있어요.</p>
          ) : memberId === null ? (
            <p role="alert">로그인 정보를 확인할 수 없어요.</p>
          ) : ratingsQuery.isLoading ? (
            <p role="status">내 평점을 불러오는 중이에요.</p>
          ) : ratingsQuery.isError ? (
            <div role="alert">
              <p>내 평점을 불러오지 못했어요.</p>
              <button type="button" onClick={() => void ratingsQuery.refetch()}>
                다시 시도
              </button>
            </div>
          ) : savedRating ? (
            <div>
              <p>저장된 별점: {savedRating.score}점</p>
              <p>저장된 후기: {savedRating.comment || "작성한 후기가 없어요."}</p>
            </div>
          ) : (
            <p>아직 이 영화에 남긴 평점이 없어요.</p>
          )}

          <p className="h-3.5 w-full text-xs leading-none font-normal text-[#969da8]">
            별점은 필수, 후기는 선택이에요.
          </p>
          <div className="flex h-[38px] w-full items-center gap-1">
            {[1, 2, 3, 4, 5].map((score) => {
              const isSelected = score <= rating;

              return (
                <button
                  key={score}
                  type="button"
                  onClick={() => handleRatingClick(score)}
                  aria-label={`${score}점`}
                  aria-pressed={isSelected}
                  disabled={!canEditRating}
                  className={cn(
                    "box-border flex h-[38px] w-[38px] items-center justify-center rounded-lg border px-1.5 py-px disabled:cursor-not-allowed disabled:opacity-50",
                    isSelected
                      ? "border-[#2563eb] bg-blue-50"
                      : "border-[#e3e6eb] bg-white",
                  )}
                >
                  <img
                    src={
                      isSelected
                      ? "/icons/movie-icons/star.svg"
                      : "/icons/movie-icons/star-outline.svg"
                    }
                    alt=""
                    aria-hidden="true"
                    className="block h-6 w-6"
                  />
                </button>
              );
            })}
          </div>
          <textarea
            id="review-text"
            aria-label="한줄평"
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            value={comment}
            onChange={(event) => handleChangeComment(event.target.value)}
            maxLength={500}
            disabled={!canEditRating}
            className="box-border h-[102px] w-full resize-none rounded-lg border border-[#e3e6eb] bg-white pt-4 pr-3 pb-[18px] pl-3 disabled:cursor-not-allowed disabled:opacity-50"
          />

          <button
            id="save-rating"
            type="button"
            onClick={handleSaveRating}
            disabled={!canEditRating || rating === 0}
            aria-busy={saveRatingMutation.isPending}
            className="box-border flex h-[42px] w-full items-center justify-center rounded-lg border border-white bg-[#17191e] px-4 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-center text-sm font-extrabold">
              {saveRatingMutation.isPending
                ? "저장 중"
                : savedRating
                  ? "평점 수정"
                  : "평점 저장"}
            </span>
          </button>
          {savedRating && memberId !== null && (
            <button
              id="delete-rating"
              type="button"
              onClick={handleDeleteRating}
              disabled={!canEditRating}
              aria-busy={deleteRatingMutation.isPending}
              className="box-border flex h-[42px] w-full items-center justify-center rounded-lg border border-red-200 bg-white px-4 text-sm font-bold text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleteRatingMutation.isPending ? "삭제 중" : "평점 삭제"}
            </button>
          )}
        </aside>
      </section>
    </main>
  );
}
