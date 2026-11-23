"use client";

import Link from "next/link";
import { useQueries } from "@tanstack/react-query";
import { getMovieDetailFromRoute } from "@/api/movies/get-movie-detail-from-route";
import type { TmdbMovieDetail } from "@/api/movies/models";
import { MovieGrid } from "@/components/movies/movie-grid";
import { useFavoritesQuery } from "@/hooks/use-favorites";
import { useMeQuery } from "@/hooks/use-me-query";
import { AvatarIcon } from "./avatar-icon";

export function MyPageContent() {
  const meQuery = useMeQuery();
  const member = meQuery.data;

  const favoritesQuery = useFavoritesQuery();
  const favorites = favoritesQuery.data ?? [];

  // 즐겨찾기 응답에는 movieId만 있어서, 포스터와 제목은 영화마다 따로 받아와야 합니다.
  // 개수가 정해져 있지 않으므로 useQuery를 개수만큼 쓸 수 없어 useQueries를 씁니다.
  const movieQueries = useQueries({
    queries: favorites.map((favorite) => ({
      queryKey: ["movies", "detail", favorite.movieId],
      queryFn: () => getMovieDetailFromRoute(favorite.movieId),
      staleTime: 30 * 1000,
    })),
  });

  const movies = movieQueries
    .map((movieQuery) => movieQuery.data)
    .filter((movie): movie is TmdbMovieDetail => movie !== undefined);

  const isMoviesLoading =
    favoritesQuery.isPending ||
    movieQueries.some((movieQuery) => movieQuery.isPending);

  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#f5f6f8] pb-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex items-center justify-between pt-10 pb-6">
          <h1 className="text-[32px] font-bold text-neutral-900">내 정보</h1>
          <Link
            href="/my/edit"
            className="inline-flex items-center rounded-md bg-blue-600 px-5 py-3 text-sm font-bold text-white"
          >
            정보 수정
          </Link>
        </div>

        <section className="border-t border-neutral-200 py-8">
          <h2 className="text-base font-bold text-neutral-900">기본 정보</h2>

          <div className="mt-6 flex items-center gap-8">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-neutral-200">
              <AvatarIcon className="h-10 w-10 text-neutral-500" />
            </div>

            <dl className="grid max-w-[720px] flex-1 grid-cols-2 gap-x-10">
              <div>
                <dt className="text-sm text-neutral-400">닉네임</dt>
                <dd className="mt-1.5 text-base font-bold text-neutral-900">
                  {member?.nickname ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-neutral-400">이메일</dt>
                <dd className="mt-1.5 text-base font-bold text-neutral-900">
                  {member?.email ?? "—"}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="border-t border-neutral-200 py-8">
          <h2 className="text-base font-bold text-neutral-900">내 즐겨찾기</h2>

          {isMoviesLoading ? (
            <p className="py-20 text-center text-neutral-500">불러오는 중이에요.</p>
          ) : movies.length === 0 ? (
            <p className="py-20 text-center text-neutral-500">
              즐겨찾기한 영화가 없어요.
            </p>
          ) : (
            <div className="mt-5">
              <MovieGrid movies={movies} />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
