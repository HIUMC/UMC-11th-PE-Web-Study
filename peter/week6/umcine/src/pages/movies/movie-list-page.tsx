import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { useMoviePreferenceStore } from "../../stores/movie-preference-store";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { movieListQueryOptions } from "../../api/movies/movie-query-options";


export function MovieListPage() {
  const sortOption = useMoviePreferenceStore(
    (state) => state.sortOption,
  );

  const setSortOption = useMoviePreferenceStore(
    (state) => state.setSortOption,
  );
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery(movieListQueryOptions(page));

  const movies = moviesQuery.data?.results ?? [];
  
  return (
    <main className="box-border flex min-h-[1185px] w-full flex-col gap-5 bg-[#f6f7f9] px-5 py-6 min-[481px]:px-10 min-[769px]:px-20">
      <div className="flex items-center justify-between gap-4">
        <h1 className="m-0 text-[32px] leading-[38px] font-extrabold tracking-[-0.8px] text-[#17191e]">
          영화 목록
        </h1>

        <select
          value={sortOption}
          onChange={(event) =>
            setSortOption(
              event.target.value === "title" ? "title" : "default",
            )
          }
          aria-label="영화 정렬"
          className="h-10 rounded-lg border border-[#e3e6eb] bg-white px-3 text-sm text-[#17191e]"
        >
          <option value="default">기본순</option>
          <option value="title">제목순</option>
        </select>
      </div>

      {moviesQuery.isPending ? (
        <p role="status">영화 목록을 불러오는 중입니다.</p>
      ) : moviesQuery.isError ? (
        <div className="flex flex-col items-start gap-3">
          <p role="alert">영화 목록을 불러오지 못했어요.</p>

          <button
            type="button"
            onClick={() => void moviesQuery.refetch()}
            className="cursor-pointer rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-bold text-white"
          >
            다시 시도
          </button>
        </div>
      ) : movies.length === 0 ? (
        <p>조건에 맞는 영화가 없습니다.</p>
      ) : (
        <>
          <MovieGrid movies={movies} />
          <Pagination currentPage={page} onPageChange={setPage} />
        </>
      )}
    </main>
  );
}
