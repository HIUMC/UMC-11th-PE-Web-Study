"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { getMovieDetail } from "../../api/movies/get-movie-detail";

import {
  getTmdbPosterUrl,
  getTmdbBackdropUrl,
} from "../../utils/movies/tmdb-image";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";

import { cn } from "../../utils/cn";
import { useRouter } from "next/navigation";

import { getFavoriteStatus } from "@/api/favorites/get-favorite-status";
import { useAuthStore } from "@/stores/auth-store";
import { useCreateFavoriteMutation } from "@/hooks/use-create-favorite-mutation";
import { useDeleteFavoriteMutation } from "@/hooks/use-delete-favorite-mutation";

import { getMe } from "../../api/members/me";
import { getMemberRatings } from "../../api/ratings/get-member-ratings";

import { useCreateRatingMutation } from "../../hooks/use-create-rating-mutation";
import { useUpdateRatingMutation } from "../../hooks/use-update-rating-mutation";
import { useDeleteRatingMutation } from "../../hooks/use-delete-rating-mutation";

interface MovieDetailPageProps {
  movieId: string;
}

export function MovieDetailPage({
  movieId: movieIdParam,
}: MovieDetailPageProps) {
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  // TanStack Query를 이용한 영화 상세 정보 요청
  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
  });


  // 로그인 토큰
  const accessToken = useAuthStore((state) => state.accessToken);

  // 내 정보 조회
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // 회원 ID
  const memberId = meQuery.data?.memberId;
  // 평점 등록 Mutation
  const createRatingMutation = useCreateRatingMutation(memberId);
  const updateRatingMutation = useUpdateRatingMutation(memberId);
  const deleteRatingMutation = useDeleteRatingMutation(memberId);

  // 내가 작성한 영화 평점 조회
  const ratingsQuery = useQuery({
    queryKey: ["members", memberId, "ratings"],
    queryFn: () => getMemberRatings(memberId!),
    enabled: Boolean(accessToken && memberId),
    retry: false,
  });

  // 페이지 이동
  const router = useRouter();

  // 현재 영화의 즐겨찾기 여부 조회
  const favoriteStatusQuery = useQuery({
    queryKey: ["favorites", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: isValidMovieId && Boolean(accessToken),
    retry: false,
  });

  // 즐겨찾기 등록 및 삭제 Mutation
  const createFavoriteMutation = useCreateFavoriteMutation();
  const deleteFavoriteMutation = useDeleteFavoriteMutation();

  // 현재 즐겨찾기 여부
  const isFavorite = favoriteStatusQuery.data ?? false;

  // 기존 별점 및 리뷰 기능
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");

  const myRating = ratingsQuery.data?.find(
    (item) => item.movieId === movieId,
  );

  useEffect(() => {
    if (myRating) {
      setRating(myRating.score);
      setReview(myRating.comment ?? "");
    } else {
      setRating(0);
      setReview("");
    }
  }, [myRating?.ratingId, myRating?.score, myRating?.comment, movieId]);

  // 올바르지 않은 영화 ID
  if (!isValidMovieId) {
    return (
      <main className="py-24 text-center text-text-sub">
        올바르지 않은 영화 번호예요.
      </main>
    );
  }

  // 로딩 상태
  if (movieDetailQuery.isPending) {
    return (
      <main className="py-24 text-center text-text-sub">
        영화 정보를 불러오는 중이에요.
      </main>
    );
  }

  // 오류 상태
  if (movieDetailQuery.isError) {
    return (
      <main className="py-24 text-center text-text-sub">
        {getMovieDetailErrorMessage(movieDetailQuery.error)}
      </main>
    );
  }

  // 영화 데이터
  const movie = movieDetailQuery.data;

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

  function handleToggleFavorite() {
    // 로그인하지 않았다면 로그인 페이지로 이동
    if (!accessToken) {
      router.push("/login");
      return;
    }

    // 조회 중이거나 변경 요청 중이면 중복 실행 방지
    if (
      favoriteStatusQuery.isLoading ||
      createFavoriteMutation.isPending ||
      deleteFavoriteMutation.isPending
    ) {
      return;
    }

    // 이미 찜한 영화라면 삭제
    if (isFavorite) {
      deleteFavoriteMutation.mutate(movieId);
    } else {
      // 아직 찜하지 않았다면 추가
      createFavoriteMutation.mutate({ movieId });
    }
  }

  function handleSubmitReview() {
    // 로그인 확인
    if (!accessToken) {
      router.push("/login");
      return;
    }

    // 회원 정보 확인
    if (!memberId) {
      alert("회원 정보를 불러오는 중이에요.");
      return;
    }

    // 기존 평점 조회 확인
    if (ratingsQuery.isPending) {
      alert("기존 평점을 확인하는 중이에요.");
      return;
    }

    if (ratingsQuery.isError) {
      alert("기존 평점을 확인하지 못했습니다.");
      return;
    }

    // 별점 확인
    if (rating < 1 || rating > 5) {
      alert("별점을 선택해 주세요.");
      return;
    }

    // 중복 요청 방지
    if (
      createRatingMutation.isPending ||
      updateRatingMutation.isPending
    ) {
      return;
    }

    const body = {
      score: rating,
      comment: review.trim(),
    };

    // 기존 평점이 있으면 수정
    if (myRating) {
      updateRatingMutation.mutate({
        ratingId: myRating.ratingId,
        body,
      });
    } else {
      // 기존 평점이 없으면 신규 등록
      createRatingMutation.mutate({
        movieId,
        ...body,
      });
    }
  }

  function handleDeleteRating() {
    if (!accessToken) {
      router.push("/login");;
      return;
    }

    if (!myRating || deleteRatingMutation.isPending) {
      return;
    }

    const confirmed = window.confirm(
      "작성한 평점을 삭제하시겠습니까?",
    );

    if (!confirmed) return;

    deleteRatingMutation.mutate(myRating.ratingId);
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
          href="/"
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

        {/* 즐겨찾기 버튼 */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          disabled={
            favoriteStatusQuery.isLoading ||
            favoriteStatusQuery.isError ||
            createFavoriteMutation.isPending ||
            deleteFavoriteMutation.isPending
          }
          aria-pressed={isFavorite}
          className={cn(
            "mt-4 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50",
            isFavorite
              ? "border-primary bg-primary text-white"
              : "border-border bg-surface text-text",
          )}
        >
          <img
            src={
              isFavorite
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
            className={cn(
              "h-4 w-4",
              isFavorite && "brightness-0 invert",
            )}
          />

          {createFavoriteMutation.isPending
            ? "추가 중..."
            : deleteFavoriteMutation.isPending
              ? "해제 중..."
              : isFavorite
                ? "즐겨찾기됨"
                : favoriteStatusQuery.isLoading
                  ? "확인 중..."
                  : "즐겨찾기"}
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

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleSubmitReview}
              disabled={
                createRatingMutation.isPending ||
                updateRatingMutation.isPending ||
                deleteRatingMutation.isPending ||
                (Boolean(accessToken) && ratingsQuery.isPending)
              }
              className="flex-1 rounded-lg bg-gray-900 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createRatingMutation.isPending
                ? "저장 중..."
                : updateRatingMutation.isPending
                  ? "수정 중..."
                  : deleteRatingMutation.isPending
                    ? "삭제 중..."
                    : myRating
                      ? "평점 수정"
                      : "평점 저장"}
            </button>

            {myRating && (
              <button
                type="button"
                onClick={handleDeleteRating}
                disabled={
                  deleteRatingMutation.isPending ||
                  createRatingMutation.isPending ||
                  updateRatingMutation.isPending
                }
                className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteRatingMutation.isPending
                  ? "삭제 중..."
                  : "평점 삭제"}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}