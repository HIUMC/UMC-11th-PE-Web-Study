import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { useRemoveFavoriteMutation } from "../../hooks/use-favorite-mutations";
import { useFavoritesQuery } from "../../hooks/use-favorites-query";
import { useLogout } from "../../hooks/use-logout";
import { useMyInfoQuery } from "../../hooks/use-my-info-query";
import { useDeleteRatingMutation } from "../../hooks/use-rating-mutations";
import { useMemberRatingsQuery } from "../../hooks/use-ratings-query";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

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

export function MyPage() {
  const myInfoQuery = useMyInfoQuery();
  const favoritesQuery = useFavoritesQuery();
  const memberRatingsQuery = useMemberRatingsQuery(myInfoQuery.data?.memberId);
  const logout = useLogout();

  const [favoriteErrorMessage, setFavoriteErrorMessage] = useState<
    string | null
  >(null);
  const [ratingErrorMessage, setRatingErrorMessage] = useState<string | null>(
    null,
  );

  const removeFavoriteMutation = useRemoveFavoriteMutation({
    onErrorMessage: setFavoriteErrorMessage,
  });
  const deleteRatingMutation = useDeleteRatingMutation(
    myInfoQuery.data?.memberId,
    {
      onErrorMessage: setRatingErrorMessage,
    },
  );

  const favorites = favoritesQuery.data ?? [];
  const ratings = memberRatingsQuery.data ?? [];

  // 즐겨찾기와 평점에 등장하는 영화 ID를 중복 제거해 영화 상세 캐시(["movies", "detail", ...])를 공유해요.
  const uniqueMovieIds = Array.from(
    new Set([
      ...favorites.map((item) => item.movieId),
      ...ratings.map((item) => item.movieId),
    ]),
  );

  const movieDetailQueries = useQueries({
    queries: uniqueMovieIds.map((movieId) => ({
      queryKey: ["movies", "detail", { movieId }],
      queryFn: () => getMovieDetail(movieId),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const movieMap = new Map<number, TmdbMovieDetail>();
  uniqueMovieIds.forEach((movieId, index) => {
    const movie = movieDetailQueries[index]?.data;
    if (movie) {
      movieMap.set(movieId, movie);
    }
  });

  // 1. 내 정보 로딩 상태
  if (myInfoQuery.isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">내 정보를 불러오는 중이에요.</p>
      </div>
    );
  }

  // 2. 내 정보 오류 상태
  if (myInfoQuery.isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold text-gray-900">
          내 정보를 불러오지 못했어요.
        </p>
        <button
          type="button"
          onClick={() => myInfoQuery.refetch()}
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          다시 시도하기
        </button>
      </div>
    );
  }

  const member = myInfoQuery.data;
  const joinedDate = formatDate(member.createdAt);

  // 3. 성공 상태
  return (
    <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
      <div className="flex flex-col gap-10">
        {/* 1. 내 정보 카드 */}
        <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xs">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white"
              >
                {member.nickname.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-extrabold text-gray-950">
                  {member.nickname}
                </h1>
                <p className="truncate text-sm text-gray-500">{member.email}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                to="/me/edit"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                정보 수정
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                로그아웃
              </button>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-1 divide-y divide-gray-100 rounded-xl border border-gray-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="flex items-center justify-between px-4 py-3.5 sm:flex-col sm:items-start sm:gap-1">
              <dt className="text-xs font-semibold text-gray-500">이메일</dt>
              <dd className="text-sm font-medium text-gray-900">
                {member.email}
              </dd>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5 sm:flex-col sm:items-start sm:gap-1">
              <dt className="text-xs font-semibold text-gray-500">닉네임</dt>
              <dd className="text-sm font-medium text-gray-900">
                {member.nickname}
              </dd>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5 sm:flex-col sm:items-start sm:gap-1">
              <dt className="text-xs font-semibold text-gray-500">
                {joinedDate ? "가입일" : "비밀번호"}
              </dt>
              <dd className="text-sm font-medium text-gray-900">
                {joinedDate ?? "••••••••"}
              </dd>
            </div>
          </dl>
        </section>

        {/* 2. 내 즐겨찾기 목록 (GET /favorites) */}
        <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xs">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-gray-950">
                내 즐겨찾기
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                보관한 영화 {favorites.length}편
              </p>
            </div>
            <Link
              to="/"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              영화 더 둘러보기
            </Link>
          </div>

          {favoriteErrorMessage && (
            <div
              role="alert"
              className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-xs font-medium text-red-600"
            >
              {favoriteErrorMessage}
            </div>
          )}

          {favoritesQuery.isPending ? (
            <p className="py-12 text-center text-sm text-gray-500">
              즐겨찾기 목록을 불러오는 중이에요.
            </p>
          ) : favoritesQuery.isError ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-sm font-medium text-gray-700">
                즐겨찾기 목록을 불러오지 못했어요.
              </p>
              <button
                type="button"
                onClick={() => favoritesQuery.refetch()}
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                다시 시도하기
              </button>
            </div>
          ) : favorites.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-sm text-gray-500">
                아직 즐겨찾기한 영화가 없어요.
              </p>
              <Link
                to="/"
                className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-black"
              >
                영화 목록 보러 가기
              </Link>
            </div>
          ) : (
            <ul className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
              {favorites.map((favorite) => {
                const movie = movieMap.get(favorite.movieId);
                const posterUrl = movie
                  ? getTmdbPosterUrl(movie.poster_path)
                  : null;
                const movieTitle = movie?.title ?? `영화 #${favorite.movieId}`;
                const addedDate = formatDate(favorite.createdAt);

                return (
                  <li
                    key={favorite.favoriteId}
                    className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white"
                  >
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(favorite.movieId) }}
                      className="block aspect-[2/3] w-full overflow-hidden bg-gray-100"
                    >
                      {posterUrl ? (
                        <img
                          src={posterUrl}
                          alt={`${movieTitle} 포스터`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center px-3 text-center text-xs text-gray-500">
                          {movie ? "이미지 없음" : "영화 정보 불러오는 중"}
                        </div>
                      )}
                    </Link>

                    <div className="flex flex-1 flex-col justify-between gap-3 p-3.5">
                      <div>
                        <Link
                          to="/movies/$movieId"
                          params={{ movieId: String(favorite.movieId) }}
                        >
                          <h3 className="truncate text-sm font-bold text-gray-900 hover:text-blue-600">
                            {movieTitle}
                          </h3>
                        </Link>
                        <p className="mt-0.5 text-xs text-gray-400">
                          {movie?.release_date || addedDate || ""}
                        </p>
                      </div>

                      <button
                        type="button"
                        aria-label={`${movieTitle} 즐겨찾기 해제`}
                        disabled={removeFavoriteMutation.isPending}
                        onClick={() => {
                          setFavoriteErrorMessage(null);
                          removeFavoriteMutation.mutate(favorite.movieId);
                        }}
                        className="w-full rounded-lg border border-gray-200 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        즐겨찾기 해제
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* 3. 내가 남긴 평점 목록 (GET /members/{memberId}/ratings) */}
        <section
          id="ratings"
          className="scroll-mt-20 rounded-2xl border border-gray-200 bg-white p-8 shadow-xs"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-gray-950">
                내가 남긴 평점
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                작성한 평점 {ratings.length}개
              </p>
            </div>
          </div>

          {ratingErrorMessage && (
            <div
              role="alert"
              className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-xs font-medium text-red-600"
            >
              {ratingErrorMessage}
            </div>
          )}

          {memberRatingsQuery.isPending ? (
            <p className="py-12 text-center text-sm text-gray-500">
              평점 목록을 불러오는 중이에요.
            </p>
          ) : memberRatingsQuery.isError ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-sm font-medium text-gray-700">
                평점 목록을 불러오지 못했어요.
              </p>
              <button
                type="button"
                onClick={() => memberRatingsQuery.refetch()}
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                다시 시도하기
              </button>
            </div>
          ) : ratings.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">
              아직 작성한 영화 평점이 없어요. 영화 상세 페이지에서 별점과 후기를
              남겨보세요.
            </p>
          ) : (
            <ul className="mt-6 flex flex-col gap-4">
              {ratings.map((rating) => {
                const movie = movieMap.get(rating.movieId);
                const posterUrl = movie
                  ? getTmdbPosterUrl(movie.poster_path)
                  : null;
                const movieTitle = movie?.title ?? `영화 #${rating.movieId}`;
                const updatedDate = formatDate(
                  rating.updatedAt || rating.createdAt,
                );

                return (
                  <li
                    key={rating.ratingId}
                    className="flex gap-4 rounded-xl border border-gray-200 p-4"
                  >
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(rating.movieId) }}
                      className="aspect-[2/3] w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100"
                    >
                      {posterUrl ? (
                        <img
                          src={posterUrl}
                          alt={`${movieTitle} 포스터`}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                          포스터
                        </div>
                      )}
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Link
                            to="/movies/$movieId"
                            params={{ movieId: String(rating.movieId) }}
                            className="truncate text-sm font-bold text-gray-900 hover:text-blue-600"
                          >
                            {movieTitle}
                          </Link>
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                            <span aria-hidden="true">★</span>
                            {rating.score} / 5
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm text-gray-600">
                          {rating.comment || "작성한 후기가 없어요."}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-3 text-xs text-gray-400">
                        <span>{updatedDate ?? ""}</span>
                        <div className="flex items-center gap-3">
                          <Link
                            to="/movies/$movieId"
                            params={{ movieId: String(rating.movieId) }}
                            aria-label={`${movieTitle} 평점 수정`}
                            className="font-semibold text-blue-600 hover:underline"
                          >
                            수정
                          </Link>
                          <button
                            type="button"
                            aria-label={`${movieTitle} 평점 삭제`}
                            disabled={deleteRatingMutation.isPending}
                            onClick={() => {
                              setRatingErrorMessage(null);
                              deleteRatingMutation.mutate(rating.ratingId);
                            }}
                            className="font-semibold text-gray-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default MyPage;
