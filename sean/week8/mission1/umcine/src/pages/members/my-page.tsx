import { Link } from "@tanstack/react-router";
import { useQueries, useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/members/me";
import { getMovieDetail } from "@/api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "@/api/movies/models";
import { MovieGrid } from "@/components/movies/movie-grid";
import { useFavoritesQuery } from "@/hooks/use-favorites";


function AvatarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0z" />
    </svg>
  );
}

export function MyPage() {

    const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
  });

  const member = meQuery.data;

  // 즐겨찾기 API는 8주차 예정이라, 화면 확인용으로 인기 영화 일부를 보여줘요
    const favoritesQuery = useFavoritesQuery();
  const favorites = favoritesQuery.data ?? [];

  const movieQueries = useQueries({
    queries: favorites.map((favorite) => ({
      queryKey: ["movies", "detail", favorite.movieId],
      queryFn: () => getMovieDetail(favorite.movieId),
      staleTime: 30 * 1000,
    })),
  });

  const movies = movieQueries
    .map((movieQuery) => movieQuery.data)
    .filter((movie): movie is TmdbMovieDetail => movie !== undefined);

  const isMoviesLoading =
    favoritesQuery.isPending || movieQueries.some((movieQuery) => movieQuery.isPending);

  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#f5f6f8] pb-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex items-center justify-between pt-10 pb-6">
          <h1 className="text-[32px] font-bold text-neutral-900">내 정보</h1>
          <Link
            to="/my/edit"
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
            <p className="py-20 text-center text-neutral-500">즐겨찾기한 영화가 없어요.</p>
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