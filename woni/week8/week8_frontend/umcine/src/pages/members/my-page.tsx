import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueries, useQuery } from "@tanstack/react-query";
import { favoriteQueries } from "@/api/favorites/favorite-queries";
import { memberQueries } from "@/api/members/member-queries";
import { movieQueries } from "@/api/movies/movie-queries";
import { FavoriteRemoveButton } from "@/components/favorite-remove-button";
import { MovieCard } from "@/components/movies/movie-card";
import { Pagination } from "@/components/movies/pagination";
import type { MovieCardItem } from "@/types/movie-card";
import { toMovieCardItem } from "@/utils/movies/movie-card-adapter";

const PAGE_SIZE = 5;

// 공통 스타일
const SECTION_TITLE_CLASS = "text-[17px] font-bold text-[#17191e]";
const INFO_LABEL_CLASS = "text-[11px] text-[#969da8]";
const INFO_VALUE_CLASS = "text-sm font-bold text-[#17191e]";
const EMPTY_TEXT_CLASS = "py-6 text-center text-sm text-[#606774]";

export function MyPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const meQuery = useQuery(memberQueries.me());
  const profile = meQuery.data;

  // 즐겨찾기 목록은 movieId만 주므로 영화 정보는 TMDB 상세 조회로 채움
  const favoritesQuery = useQuery(favoriteQueries.list());
  const favorites = favoritesQuery.data ?? [];

  const totalPages = Math.ceil(favorites.length / PAGE_SIZE);
  // 해제로 마지막 페이지가 사라지면 남아 있는 마지막 페이지를 보여 줌
  const page = Math.min(currentPage, Math.max(totalPages, 1));
  const pagedFavorites = favorites.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  // 현재 페이지에 보이는 영화만 상세 조회 (영화마다 ["movies", "detail", id] 캐시 사용)
  const movieDetailQueries = useQueries({
    queries: pagedFavorites.map((favorite) =>
      movieQueries.detail(favorite.movieId),
    ),
  });
  const isMovieDetailLoading = movieDetailQueries.some(
    (query) => query.isPending,
  );
  const pagedMovies: MovieCardItem[] = movieDetailQueries.flatMap((query) =>
    query.data ? [toMovieCardItem(query.data)] : [],
  );

  return (
    <main className="flex min-h-[calc(100vh-148px)] flex-col gap-7 bg-[#f6f7f9] px-20 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[31px] font-bold tracking-[-1.24px] text-[#17191e]">
          내 정보
        </h1>
        <Link
          to="/my/edit"
          className="flex h-[42px] items-center rounded-lg bg-[#2563eb] px-4 text-sm font-extrabold text-white"
        >
          정보 수정
        </Link>
      </div>

      <section className="flex flex-col gap-4 border-y border-[#e3e6eb] py-3">
        <h2 className={SECTION_TITLE_CLASS}>기본 정보</h2>
        <div className="flex items-center gap-7">
          <span className="flex size-[82px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e3e6eb]">
            <img src="/icons/person.svg" alt="" width={48} height={48} />
          </span>
          <dl className="grid w-[760px] max-w-full grid-cols-2 gap-7">
            <div className="flex flex-col gap-1.5">
              <dt className={INFO_LABEL_CLASS}>닉네임</dt>
              <dd className={INFO_VALUE_CLASS}>
                {profile?.nickname ?? "-"}
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <dt className={INFO_LABEL_CLASS}>이메일</dt>
              <dd className={INFO_VALUE_CLASS}>{profile?.email ?? "-"}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className={SECTION_TITLE_CLASS}>내 즐겨찾기</h2>
        {favoritesQuery.isPending ? (
          <p className={EMPTY_TEXT_CLASS}>즐겨찾기를 불러오는 중이에요.</p>
        ) : favoritesQuery.isError ? (
          <p className={EMPTY_TEXT_CLASS}>
            즐겨찾기를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
          </p>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <p className={EMPTY_TEXT_CLASS}>아직 즐겨찾기한 영화가 없어요.</p>
            <Link
              to="/"
              className="flex h-[42px] items-center rounded-lg bg-[#2563eb] px-4 text-sm font-extrabold text-white"
            >
              영화 둘러보기
            </Link>
          </div>
        ) : (
          <>
            {isMovieDetailLoading ? (
              <p className={EMPTY_TEXT_CLASS}>영화 정보를 불러오는 중이에요.</p>
            ) : (
              <div className="grid grid-cols-5 gap-x-[18px] gap-y-5">
                {pagedMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    actionButton={
                      <FavoriteRemoveButton
                        movieId={movie.id}
                        movieTitle={movie.title}
                      />
                    }
                  />
                ))}
              </div>
            )}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </section>
    </main>
  );
}
