"use client";

import { useQueries } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { getMovieDetail } from "@/api/movies/get-movie-detail";
import { useFavoritesQuery } from "@/hooks/use-favorites";
import { useMeQuery } from "@/hooks/use-me-query";
import { getTmdbPosterUrl } from "@/utils/movies/tmdb-image";

export function MyPage() {
  const { data: me } = useMeQuery();
  const favoritesQuery = useFavoritesQuery();
  const favorites = favoritesQuery.data ?? [];

  // 서버는 movieId만 주므로 TMDB에서 영화별 상세 정보를 함께 조회
  const movieQueries = useQueries({
    queries: favorites.map((favorite) => ({
      queryKey: ["movies", "detail", favorite.movieId],
      queryFn: () => getMovieDetail(favorite.movieId),
      staleTime: 30 * 1000,
    })),
  });

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-gray-900">내 정보</h1>
        <Link
          href="/my/edit"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white"
        >
          정보 수정
        </Link>
      </div>

      {/* 기본 정보 */}
      <section className="border-t border-gray-200 py-5">
        <h2 className="mb-4 text-base font-bold text-gray-900">기본 정보</h2>
        <div className="flex items-center gap-7">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-gray-900">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
            </svg>
          </div>
          <div className="w-[394px]">
            <p className="text-xs text-gray-400">닉네임</p>
            <p className="mt-1 text-sm font-bold text-gray-900">{me?.nickname ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">이메일</p>
            <p className="mt-1 text-sm font-bold text-gray-900">{me?.email ?? "-"}</p>
          </div>
        </div>
      </section>

      {/* 내 즐겨찾기 */}
      <section className="border-t border-gray-200 py-5">
        <h2 className="mb-4 text-base font-bold text-gray-900">내 즐겨찾기</h2>
        {favoritesQuery.isPending ? (
          <p className="text-sm text-gray-400">즐겨찾기를 불러오는 중이에요.</p>
        ) : favorites.length === 0 ? (
          <p className="text-sm text-gray-400">아직 즐겨찾기한 영화가 없어요.</p>
        ) : (
          <ul className="grid grid-cols-3 gap-[18px] md:grid-cols-4 lg:grid-cols-5">
            {favorites.map((favorite, index) => {
              const movie = movieQueries[index]?.data;
              const posterUrl = getTmdbPosterUrl(movie?.poster_path ?? null);
              return (
                <li key={favorite.favoriteId}>
                  <Link
                    href={`/movies/${favorite.movieId}`}
                  >
                    {posterUrl ? (
                      <Image
                        src={posterUrl}
                        alt={movie?.title ?? ""}
                        width={241}
                        height={274}
                        sizes="(max-width: 768px) 33vw, 20vw"
                        className="aspect-[241/274] w-full rounded-xl object-cover"
                      />
                    ) : (
                      <div className="aspect-[241/274] w-full rounded-xl bg-gray-300" />
                    )}
                    <p className="mt-2 text-sm font-bold text-gray-900">
                      {movie?.title ?? `영화 #${favorite.movieId}`}
                    </p>
                  </Link>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {favorite.createdAt.slice(0, 10).replace(/-/g, ".")}
                  </p>
                </li>
              );
            })}
          </ul>
        )}

        {/* 페이지네이션 (모양만) */}
        <div className="mt-8 flex items-center justify-center gap-4 text-gray-300">
          <span>‹</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-sm font-bold text-white">
            1
          </span>
          <span>›</span>
        </div>
      </section>
    </main>
  );
}