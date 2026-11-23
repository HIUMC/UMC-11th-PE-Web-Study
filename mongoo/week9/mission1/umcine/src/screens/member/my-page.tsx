"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useProfileStore } from "../../stores/profile-store";
import { getFavorites } from "../../api/favorites/get-favorites";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import Pagination from "../../components/movies/pagination";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

function BookmarkedMovie({ movieId }: { movieId: number }) {
  const movieQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    staleTime: 30 * 1000,
  });

  if (movieQuery.isPending) {
    return (
      <div role="status" className="min-w-0">
        <div className="aspect-[200/228] animate-pulse rounded-lg bg-gray-200" />
        <p className="mt-2 text-xs text-gray-500">불러오는 중이에요.</p>
      </div>
    );
  }

  if (movieQuery.isError) {
    return (
      <div
        role="alert"
        className="flex aspect-[200/228] items-center justify-center rounded-lg bg-gray-200 p-3 text-center text-xs text-gray-500"
      >
        영화 정보를 불러오지 못했어요.
      </div>
    );
  }

  const movie = movieQuery.data;
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <Link
      href={`/movies/${movie.id}`}
      className="block min-w-0"
    >
      <div className="aspect-[200/228] overflow-hidden rounded-lg">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-200 text-sm text-gray-500">
            이미지 없음
          </div>
        )}
      </div>

      <p className="mt-[7px] truncate text-[13px] font-bold">
        {movie.title}
      </p>

      <p className="mt-[3px] text-[11px] text-gray-400">
        {movie.release_date}
      </p>
    </Link>
  );
}

export function MyPage() {
  const profileImage = useProfileStore(
    (state) => state.profile.profileImage,
  );
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  const favoritesQuery = useQuery({
    queryKey: ["favorites", "list", accessToken],
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
  });
  
  const bookmarkedMovieIds =
    favoritesQuery.data?.map((favorite) => favorite.movieId) ?? [];

  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(bookmarkedMovieIds.length / 10);
  const currentPage = Math.min(page, Math.max(1, totalPages));

  const visibleMovieIds = bookmarkedMovieIds.slice(
    (currentPage - 1) * 10,
    currentPage * 10,
  );

  if (!accessToken) {
    return (
      <main className="page-container py-24 text-center">
        <p className="text-sm text-gray-500">
          로그인이 필요해요.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block text-sm font-semibold text-blue-600"
        >
          로그인하기
        </Link>
      </main>
    );
  }

  if (meQuery.isPending) {
    return (
      <main className="page-container py-24 text-center text-gray-500">
        내 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (meQuery.isError) {
    return (
      <main
        role="alert"
        className="page-container py-24 text-center text-gray-500"
      >
        내 정보를 불러오지 못했어요.
      </main>
    );
  }

  const member = meQuery.data;

  return (
    <main className="page-container flex-1 pb-12 pt-5">
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <h1 className="text-[28px] font-bold tracking-tight">
          내 정보
        </h1>

        <Link href="/mypage/edit" className="rounded-md bg-[#2563eb] px-4 py-2.5 text-xs font-semibold text-white">
          정보 수정
        </Link>
      </div>

      <section
        aria-labelledby="profile-heading"
        className="border-b border-gray-200 py-4"
      >
        <h2 id="profile-heading" className="mb-4 text-sm font-bold">
          기본 정보
        </h2>

        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
            <img
              src={profileImage ?? "/icons/person.svg"}
              alt="프로필"
              className={
                profileImage
                ? "h-full w-full object-cover"
                : "h-10 w-10"
              }
            />
          </div>

          <dl className="grid min-w-0 flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <dt className="mb-1 text-[10px] text-gray-400">
                닉네임
              </dt>
              <dd className="break-words text-sm font-semibold">
                {member.nickname}
              </dd>
            </div>

            <div>
              <dt className="mb-1 text-[10px] text-gray-400">
                이메일
              </dt>
              <dd className="break-all text-sm font-semibold">
                {member.email}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section
        aria-labelledby="bookmarks-heading"
        className="pt-6"
      >
        <h2 id="bookmarks-heading" className="mb-4 text-sm font-bold">
          내 즐겨찾기
        </h2>

        {favoritesQuery.isPending ? (
          <p
            role="status"
            className="py-16 text-center text-sm text-gray-500"
          >
            즐겨찾기를 불러오는 중이에요.
          </p>
        ) : favoritesQuery.isError ? (
          <div
            role="alert"
            className="py-16 text-center text-sm text-gray-500"
          >
            <p>즐겨찾기를 불러오지 못했어요.</p>
            <button
              type="button"
              onClick={() => void favoritesQuery.refetch()}
              disabled={favoritesQuery.isFetching}
              className="mt-3 font-semibold text-blue-600 disabled:opacity-50"
            >
              {favoritesQuery.isFetching ? "다시 불러오는 중…" : "다시 시도"}
            </button>
          </div>
        ) : bookmarkedMovieIds.length === 0 ? (
          <p className="py-16 text-center text-sm text-gray-500">
            아직 즐겨찾기한 영화가 없어요.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-x-[15px] gap-y-[18px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {visibleMovieIds.map((movieId) => (
                <BookmarkedMovie key={movieId} movieId={movieId} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </main>
  );
}