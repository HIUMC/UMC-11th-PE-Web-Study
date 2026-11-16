import { useEffect, useState } from "react";

import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { useBookmarkStore } from "../../stores/bookmark-store.ts";
import { toMovie } from "../../api/movies/movie-adapter";
import { movieListOptions } from "../../api/movies/movie-query-options.ts";

import { useQuery } from "@tanstack/react-query";

type SortOrder = "default" | "title";
const SORT_STORAGE_KEY = "umcine-sort-order";

export function MovieListPage() {
  const [page, setPage] = useState(1); //현재 페이지 번호를 관리 -> 기본값 1

  //Tanstack Query로 현재 페이지의 영화 목록을 가져옴
  const moviesQuery = useQuery(movieListOptions(page));

  //응답 데이터에서 영화 목록을 꺼냄
  //아직 데이터가 없으면 빈 배열 사용
  const movies = moviesQuery.data?.results ?? [];

  //응답 데이터에서 전체 페이지 수를 꺼냄
  //아직 데이터가 없으면 0을 사용
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  const handlePageChange = (nextPage: number) => {
    //page가 바뀌면 queryKey도 바뀌어서 해당 페이지의 데이터를 조회함
    //캐시가 있다면 -> 설정에 따라 재사용하거나 다시 가져올 수 있음
    setPage(nextPage);
  };

  const bookmarkIds = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  // 영화 데이터에 현재 북마크 상태 반영(목데이터에서 API 연동 데이터로 변경)
  // adapter로 UI 타입 변환 + 북마크 상태 반영
  const APImovies = movies.map((movie) =>
    toMovie(movie, bookmarkIds.includes(movie.id)),
  );

  //영화 정렬 기준을 설정해 브라우저에만 저장할 화면 설정 추가하기
  //저장된 설정이 'title' 이면 -> 제목순, 나머지는 기본순
  const [sortOrder, setSortOrder] = useState<SortOrder>(() =>
    localStorage.getItem(SORT_STORAGE_KEY) === "title" ? "title" : "default",
  );

  // 정렬 설정이 바뀌면 브라우저에 저장
  useEffect(() => {
    localStorage.setItem(SORT_STORAGE_KEY, sortOrder);
  }, [sortOrder]);

  //원본 배열을 복사해서 제목순으로 정렬
  const sortedMovies =
    sortOrder === "title"
      ? [...APImovies].sort((a, b) => a.title.localeCompare(b.title, "ko"))
      : APImovies;

  return (
    <>
      {/* 기존 화면의 다른 UI는 그대로 유지해요. */}
      {/* 데이터를 가져오는 중인지, 오류가 발생했는지 순서대로 확인해요. */}
      {moviesQuery.isPending ? (
        <p>영화를 불러오는 중이에요.</p> // 기존 로딩 UI가 있다면 재사용해요.
      ) : moviesQuery.isError ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200">
            <span className="text-2xl font-bold text-gray-500">!</span>
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            영화 목록을 불러오지 못했어요
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            네트워크 연결을 확인한 뒤 다시 시도해 주세요.
          </p>

          <button
            type="button"
            onClick={() => moviesQuery.refetch()}
            disabled={moviesQuery.isFetching}
            className="mt-6 cursor-pointer rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-wait disabled:opacity-50"
          >
            {moviesQuery.isFetching ? "불러오는 중…" : "다시 시도"}
          </button>
        </div>
      ) : movies.length === 0 ? (
        <p>표시할 영화가 없어요.</p> // 기존 빈 목록 UI가 있다면 재사용해요.
      ) : (
        <>
          <div>
            <MovieGrid
              APImovies={sortedMovies}
              onToggleBookMark={toggleBookmark}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
            />

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </>
  );
}
