import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { isHTTPError } from "ky";
import { useQueries, useQuery } from "@tanstack/react-query";
import { getMe } from "../api/members/me";
import { getMovieDetail } from "../api/movies/get-movie-detail";
import { useAuthStore } from "../stores/auth-store";
import { getFavorites } from "../api/favorites/get-favorites";
import { getTmdbPosterUrl } from "../utils/movies/tmdb-image";

const blueButton =
  "inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-[#2563eb] px-4 text-xs font-bold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50";
const PAGE_SIZE = 5;

function Avatar({ image }: { image: string | null }) {
  return (
    <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e2e5e9]">
      {image ? (
        <img
          src={image}
          alt="프로필 미리보기"
          className="h-full w-full object-cover"
        />
      ) : (
        <img src="/icons/movie-icons/person.svg" alt="" className="h-9 w-9" />
      )}
    </div>
  );
}

function Favorites({ memberEmail }: { memberEmail: string }) {
  const accessToken = useAuthStore((state) => state.accessToken);

  const favoritesQuery = useQuery({
    queryKey: ["members", "favorites", memberEmail],
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
    retry: false,
  });

  const ids = accessToken
    ? (favoritesQuery.data ?? []).map((favorite) => favorite.movieId)
    : [];
  const [page, setPage] = useState(1);
  const movieIds = [...new Set(ids)].filter(
    (id) => Number.isInteger(id) && id > 0,
  );
  const queries = useQueries({
    queries: movieIds.map((id) => ({
      queryKey: ["movies", "detail", id],
      queryFn: async () => {
        try {
          return await getMovieDetail(id);
        } catch (error) {
          // 없는 영화만 제외하고, 통신 오류는 재시도할 수 있도록 남겨요.
          if (isHTTPError(error) && error.response.status === 404) return null;
          throw error;
        }
      },
      staleTime: 30 * 1000,
    })),
  });
  const items = queries.map((query, index) => ({ query, id: movieIds[index] }));
  const displayItems = items.filter(
    ({ query }) => query.data !== null && (!query.isError || query.data),
  );
  const failedItems = items.filter(({ query }) => query.isError && !query.data);
  const totalPages = Math.max(1, Math.ceil(displayItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleItems = displayItems.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  if (favoritesQuery.isLoading) {
    return (
      <p role="status" className="pt-6 text-sm text-gray-500">
        즐겨찾기를 불러오는 중이에요.
      </p>
    );
  }

  if (favoritesQuery.isError) {
    return (
      <div role="alert" className="pt-6 text-sm text-gray-500">
        <p>즐겨찾기를 불러오지 못했어요.</p>
        <button
          type="button"
          onClick={() => void favoritesQuery.refetch()}
          className="mt-2 text-blue-600 underline"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <section aria-labelledby="favorites-title" className="pt-6">
      <h2 id="favorites-title" className="mb-3.5 text-sm font-bold">
        내 즐겨찾기
      </h2>
      {displayItems.length === 0 && failedItems.length === 0 ? (
        <div className="flex min-h-60 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-200 text-sm text-gray-500">
          <p>아직 즐겨찾기한 영화가 없어요.</p>
          <Link to="/" className="font-semibold text-blue-600">
            영화 둘러보기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          {visibleItems.map(({ query, id }) => {
            if (query.isPending)
              return (
                <div
                  key={id}
                  className="aspect-[7/8] animate-pulse rounded-lg bg-gray-200"
                  role="status"
                  aria-label="영화 불러오는 중"
                />
              );
            if (!query.data) return null;
            const movie = query.data;
            const poster = getTmdbPosterUrl(movie.poster_path);
            return (
              <article key={id} className="min-w-0">
                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(id) }}
                  className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
                >
                  {poster ? (
                    <img
                      src={poster}
                      alt={`${movie.title} 포스터`}
                      className="aspect-[7/8] w-full rounded-lg object-cover transition-opacity group-hover:opacity-90"
                    />
                  ) : (
                    <div className="flex aspect-[7/8] items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-500">
                      이미지 없음
                    </div>
                  )}
                  <h3 className="mt-2 truncate text-xs font-bold">
                    {movie.title}
                  </h3>
                </Link>
                <p className="mt-1 text-[11px] text-[#9ca3af]">
                  {movie.release_date
                    ? movie.release_date.replaceAll("-", ".")
                    : "개봉일 미정"}
                </p>
              </article>
            );
          })}
        </div>
      )}
      {failedItems.length > 0 && (
        <p role="status" className="mt-4 text-xs text-gray-500">
          즐겨찾기 {failedItems.length}개의 정보를 일시적으로 확인하지 못했어요.{" "}
          <button
            type="button"
            onClick={() => {
              failedItems.forEach(({ query }) => void query.refetch());
            }}
            className="font-semibold text-blue-600 underline"
          >
            다시 시도
          </button>
        </p>
      )}
      <nav
        aria-label="즐겨찾기 페이지"
        className="mt-8 flex items-center justify-center gap-4"
      >
        <button
          type="button"
          aria-label="이전 페이지"
          disabled={currentPage <= 1}
          onClick={() => setPage(currentPage - 1)}
          className="h-8 w-4 text-2xl text-blue-600 disabled:text-blue-100"
        >
          ‹
        </button>
        <span
          aria-current="page"
          className="flex h-8 min-w-8 items-center justify-center rounded-md bg-[#191c21] px-2 text-xs font-bold text-white"
        >
          {currentPage}
        </span>
        <button
          type="button"
          aria-label="다음 페이지"
          disabled={currentPage >= totalPages}
          onClick={() => setPage(currentPage + 1)}
          className="h-8 w-4 text-2xl text-blue-600 disabled:text-blue-100"
        >
          ›
        </button>
      </nav>
    </section>
  );
}

export function AccountPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  const member = accessToken ? meQuery.data : undefined;

  return (
    <main className="flex flex-1 flex-col bg-[#F6F7F9]">
      <div className="mx-auto w-full max-w-[1440px] flex-1 px-5 pb-16 pt-6 sm:px-8 md:px-10 xl:px-20">
        <div className="flex items-center justify-between gap-4 border-b border-[#e0e4eb] pb-6">
          <h1 className="text-[32px] font-bold tracking-tight">내 정보</h1>
          <Link to="/account-edit" className={blueButton}>
            정보 수정
          </Link>
        </div>
        <section
          aria-labelledby="member-title"
          className="border-b border-[#e0e4eb] pb-3 pt-3"
        >
          <h2 id="member-title" className="mb-3 text-sm font-bold">
            기본 정보
          </h2>
          <div className="flex flex-wrap items-center gap-6">
            <Avatar image={null} />
            <dl className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-6">
              <div>
                <dt className="mb-1 text-[10px] text-gray-400">닉네임</dt>
                <dd className="break-words text-xs font-bold">
                  {member?.nickname ??
                    (meQuery.isLoading ? "불러오는 중…" : "—")}
                </dd>
              </div>
              <div>
                <dt className="mb-1 text-[10px] text-gray-400">이메일</dt>
                <dd className="break-all text-xs font-bold">
                  {member?.email ?? (meQuery.isLoading ? "불러오는 중…" : "—")}
                </dd>
              </div>
            </dl>
          </div>
          {!accessToken && (
            <p role="status" className="mt-3 text-xs text-gray-500">
              <Link
                to="/login"
                className="font-semibold text-blue-600 underline"
              >
                로그인
              </Link>
              하고 내 정보를 확인해 주세요.
            </p>
          )}
          {accessToken && meQuery.isError && (
            <p role="alert" className="mt-3 text-xs text-red-500">
              내 정보를 불러오지 못했어요.{" "}
              <button
                type="button"
                onClick={() => void meQuery.refetch()}
                className="underline"
              >
                다시 시도
              </button>
            </p>
          )}
        </section>
        {member && <Favorites memberEmail={member.email} />}
      </div>
    </main>
  );
}
