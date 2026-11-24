"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { getMovieDetailQueryOptions } from "../../api/movies/get-movie-detail";
import { memberRatingsQueryOptions } from "../../api/ratings/ratings";
import { BookmarkButton } from "../../components/bookmark-button";
import {
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useUpdateRatingMutation,
} from "../../hooks/use-rating-mutation";
import { useAuthStore } from "../../stores/auth-store";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

function formatRuntime(runtime: number | null) {
  if (runtime === null || runtime === undefined) {
    return "상영 시간 정보가 없어요.";
  }
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  if (hours > 0 && minutes > 0) {
    return `${hours}시간 ${minutes}분`;
  }
  if (hours > 0) {
    return `${hours}시간`;
  }
  return `${minutes}분`;
}

function getMemberIdFromToken(token: string | null): number | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );
    const rawId = decoded.memberId ?? decoded.sub;
    const parsed = Number(rawId);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  } catch {
    return null;
  }
}

export function MovieDetailPage() {
  const params = useParams<{ movieId: string }>();
  const parsedMovieId = Number(params?.movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = Boolean(accessToken);

  const movieDetailQuery = useQuery(getMovieDetailQueryOptions(parsedMovieId));
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: isLoggedIn,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const memberId = meQuery.data?.memberId ?? getMemberIdFromToken(accessToken);

  const memberRatingsQuery = useQuery(memberRatingsQueryOptions(memberId));
  const myRating = memberRatingsQuery.data?.find(
    (item) => item.movieId === parsedMovieId,
  );

  const createRatingMutation = useCreateRatingMutation(memberId);
  const updateRatingMutation = useUpdateRatingMutation(memberId);
  const deleteRatingMutation = useDeleteRatingMutation(memberId);

  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  if (!isValidMovieId) {
    return <main>올바르지 않은 영화 번호예요.</main>;
  }

  if (movieDetailQuery.isPending) {
    return <main>영화 정보를 불러오는 중이에요.</main>;
  }

  if (movieDetailQuery.isError) {
    return <main>{getMovieDetailErrorMessage(movieDetailQuery.error)}</main>;
  }

  const movie = movieDetailQuery.data;

  if (!movie) {
    return <main>영화 정보를 불러오지 못했어요.</main>;
  }

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

  const handleCreateRating = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (createRatingMutation.isPending) return;

    createRatingMutation.mutate(
      {
        movieId: parsedMovieId,
        score,
        comment: comment.trim(),
      },
      {
        onSuccess: () => {
          setComment("");
          setScore(5);
        },
      },
    );
  };

  const handleStartEdit = () => {
    if (!myRating) return;
    setScore(myRating.score);
    setComment(myRating.comment ?? "");
    setIsEditing(true);
  };

  const handleUpdateRating = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!myRating || updateRatingMutation.isPending) return;

    updateRatingMutation.mutate(
      {
        ratingId: myRating.ratingId,
        body: {
          score,
          comment: comment.trim(),
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  const handleDeleteRating = () => {
    if (!myRating || deleteRatingMutation.isPending) return;
    if (!window.confirm("등록한 평점을 삭제할까요?")) return;

    deleteRatingMutation.mutate(myRating.ratingId, {
      onSuccess: () => {
        setIsEditing(false);
        setScore(5);
        setComment("");
      },
    });
  };

  return (
    <main className="mx-auto max-w-[1000px] px-5 py-8">
      {backdropUrl ? (
        <img
          src={backdropUrl}
          alt=""
          aria-hidden="true"
          className="mb-4 max-h-[360px] w-full rounded-xl object-cover"
        />
      ) : (
        <div>이미지 없음</div>
      )}
      <Link href="/" className="text-sm font-bold text-[#2563eb] no-underline">
        ← 영화 목록
      </Link>

      <div className="mt-4 flex flex-col gap-6 md:flex-row">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${movie.title} 포스터`}
            className="w-[220px] shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div>이미지 없음</div>
        )}

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-[#17191e]">{movie.title}</h1>
          <p className="text-sm text-[#606774]">{movie.original_title}</p>
          <p className="text-sm text-[#606774]">
            {movie.release_date} ·{" "}
            {movie.genres.map((genre) => genre.name).join(", ")} ·{" "}
            {formatRuntime(movie.runtime)}
          </p>
          {movie.tagline && (
            <h2 className="text-base font-semibold text-[#17191e]">
              {movie.tagline}
            </h2>
          )}
          <p className="text-sm leading-relaxed text-[#17191e]">
            {movie.overview}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <BookmarkButton movieId={movie.id} />
            <span className="text-xs font-semibold text-[#606774]">
              즐겨찾기
            </span>
          </div>
        </div>
      </div>

      {/* 내 평점 영역 */}
      <section className="mt-10 rounded-xl border border-[#e3e6eb] bg-white p-6">
        <h2 className="mb-4 text-lg font-extrabold text-[#17191e]">내 평점</h2>

        {!isLoggedIn ? (
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#606774]">
              로그인 후 이 영화에 평점을 남길 수 있어요.
            </p>
            <Link
              href="/login"
              className="rounded-lg bg-[#2563eb] px-4 py-2 text-xs font-extrabold text-white no-underline hover:bg-[#1d4ed8]"
            >
              로그인
            </Link>
          </div>
        ) : memberRatingsQuery.isPending ? (
          <p className="text-sm text-[#606774]">
            평점 정보를 불러오는 중이에요...
          </p>
        ) : myRating && !isEditing ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-base font-extrabold text-[#2563eb]">
                ★ {myRating.score} / 5
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="cursor-pointer rounded-lg border border-[#e3e6eb] bg-white px-3 py-1.5 text-xs font-bold text-[#17191e] hover:bg-[#f6f7f9]"
                >
                  수정
                </button>
                <button
                  type="button"
                  disabled={deleteRatingMutation.isPending}
                  onClick={handleDeleteRating}
                  className="cursor-pointer rounded-lg border border-[#f97066] bg-white px-3 py-1.5 text-xs font-bold text-[#d92d20] hover:bg-[#fee4e2] disabled:opacity-50"
                >
                  {deleteRatingMutation.isPending ? "삭제 중" : "삭제"}
                </button>
              </div>
            </div>
            <p className="text-sm text-[#17191e]">
              {myRating.comment || "작성한 한줄평이 없어요."}
            </p>
          </div>
        ) : (
          <form
            onSubmit={isEditing ? handleUpdateRating : handleCreateRating}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#17191e]">별점</span>
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setScore(value)}
                  className={`h-9 w-9 cursor-pointer rounded-lg border text-sm font-extrabold transition-colors ${
                    score === value
                      ? "border-[#2563eb] bg-[#2563eb] text-white"
                      : "border-[#e3e6eb] bg-white text-[#606774] hover:bg-[#f6f7f9]"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="영화에 대한 한줄평을 남겨 보세요."
              rows={3}
              className="w-full rounded-lg border border-[#e3e6eb] p-3 text-sm text-[#17191e] outline-none focus:border-[#2563eb]"
            />

            <div className="flex items-center justify-end gap-2">
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="cursor-pointer rounded-lg border border-[#e3e6eb] bg-white px-4 py-2 text-xs font-bold text-[#606774] hover:bg-[#f6f7f9]"
                >
                  취소
                </button>
              )}
              <button
                type="submit"
                disabled={
                  createRatingMutation.isPending ||
                  updateRatingMutation.isPending
                }
                className="cursor-pointer rounded-lg border-0 bg-[#2563eb] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#1d4ed8] disabled:opacity-50"
              >
                {isEditing
                  ? updateRatingMutation.isPending
                    ? "저장 중"
                    : "평점 수정"
                  : createRatingMutation.isPending
                    ? "등록 중"
                    : "평점 등록"}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
