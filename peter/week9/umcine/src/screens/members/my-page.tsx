"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/members/me";
import { getFavorites } from "@/api/favorites/get-favorites";
import { FavoriteMovieCard } from "@/components/movies/favorite-movie-card";

const FAVORITES_PAGE_SIZE = 5;

export function MyPage() {
    const [page, setPage] = useState(1);
    const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
    });
    const favoritesQuery = useQuery({
    queryKey: ["favorites", "list"],
    queryFn: getFavorites,
    retry: false,
    });

    if (meQuery.isPending) {
    return <main role="status">내 정보를 불러오는 중이에요.</main>;
    }

    if (meQuery.isError) {
    return (
        <main role="alert">
        <p>내 정보를 불러오지 못했어요.</p>
        <button type="button" onClick={() => void meQuery.refetch()}>
            다시 시도
        </button>
        </main>
    );
    }

const member = meQuery.data;
const favorites = favoritesQuery.data ?? [];
const totalPages = Math.max(1, Math.ceil(favorites.length / FAVORITES_PAGE_SIZE));
const currentPage = Math.min(page, totalPages);
const visibleFavorites = favorites.slice(
    (currentPage - 1) * FAVORITES_PAGE_SIZE,
    currentPage * FAVORITES_PAGE_SIZE,
);

  return (
    <main className="flex min-h-[calc(100vh-148px)] w-full flex-col gap-7 bg-[#f6f7f9] px-4 py-6 sm:px-10 xl:px-20">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-extrabold text-[#17191e]">
          내 정보
        </h1>
        <Link
        href="/me/edit"
        className="rounded-lg bg-[#2563eb] px-4 py-3 text-sm font-extrabold text-white"
        >
        정보 수정
        </Link>
      </div>

      {/* 기본 정보 */}
      <section className="border-y border-[#e3e6eb] py-4">
            <h2 className="mb-4 text-base font-bold text-[#17191e]">
                기본 정보
            </h2>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#e3e6eb]">
                <img
                    src="/icons/movie-icons/person.svg"
                    alt=""
                    className="h-10 w-10"
                />
                </div>
                {/*dl은 항목 이름과 값을 짝지어 표시, dt에 실제 항목 이름, dd에 실제 값*/}
                <dl className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <dt className="mb-1 text-xs text-[#969da8]">닉네임</dt>
                    <dd className="text-sm font-bold text-[#17191e]">{member.nickname}</dd>
                </div>

                <div>
                    <dt className="mb-1 text-xs text-[#969da8]">이메일</dt>
                    <dd className="break-all text-sm font-bold text-[#17191e]">
                    {member.email}
                    </dd>
                </div>
                </dl>
            </div>
        </section>
        {/* 내 즐겨찾기 */}
        <section>
            {favoritesQuery.isPending ? (
                <p role="status">즐겨찾기를 불러오는 중이에요.</p>
                ) : favoritesQuery.isError ? (
                <div role="alert">
                    <p>즐겨찾기를 불러오지 못했어요.</p>
                    <button
                    type="button"
                    onClick={() => void favoritesQuery.refetch()}
                    >
                    다시 시도
                    </button>
                </div>
                ) : favoritesQuery.data.length === 0 ? (
                <p>아직 즐겨찾기한 영화가 없어요.</p>
                ) : (
                <ul className="m-0 grid list-none grid-cols-2 gap-5 p-0 sm:grid-cols-3 xl:grid-cols-5">
                    {visibleFavorites.map((favorite) => (
                        <li key={favorite.favoriteId}>
                        <FavoriteMovieCard movieId={favorite.movieId} />
                        </li>
                    ))}
                </ul>
                )}
            <nav
                aria-label="즐겨찾기 페이지"
                className="mt-7 flex items-center justify-center gap-3"
            >
                <button
                    type="button"
                    disabled={!favoritesQuery.isSuccess || currentPage <= 1}
                    onClick={() => setPage(currentPage - 1)}
                    aria-label="이전 페이지"
                    className="enabled:cursor-pointer disabled:opacity-20"
                >
                    <img
                        src="/icons/movie-icons/chevron-left.svg"
                        alt=""
                        className="h-6 w-6"
                    />
                </button>
                <span
                    aria-current="page"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#17191e] text-sm font-bold text-white"
                >
                    {currentPage}
                </span>
                <button
                    type="button"
                    disabled={!favoritesQuery.isSuccess || currentPage >= totalPages}
                    onClick={() => setPage(currentPage + 1)}
                    aria-label="다음 페이지"
                    className="enabled:cursor-pointer disabled:opacity-20"
                >
                    <img
                        src="/icons/movie-icons/chevron-right.svg"
                        alt=""
                        className="h-6 w-6"
                    />
                </button>
            </nav>
        </section>
    </main>
  );
}
