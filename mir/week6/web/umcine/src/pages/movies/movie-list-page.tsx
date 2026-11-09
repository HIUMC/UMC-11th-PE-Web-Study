import { useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMoviesQueryOptions } from "../../api/movies/get-movies";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { useUIStore } from "../../stores/ui-store";
import { toMovie } from "../../utils/movies/movie-adapter";

export function MovieListPage() {
  const { page } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const currentPage = page ?? 1;

  const cardSize = useUIStore((state) => state.cardSize);
  const setCardSize = useUIStore((state) => state.setCardSize);

  const moviesQuery = useQuery(getMoviesQueryOptions({ page: currentPage }));

  const movies = moviesQuery.data?.results.map(toMovie) ?? [];

  const handleRetry = () => {
    moviesQuery.refetch();
  };

  const handlePageChange = (newPage: number) => {
    navigate({
      search: (prev) => ({ ...prev, page: newPage }),
    });
  };

  return (
    <>
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-5 px-5 py-6 md:px-[80px]">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setCardSize("sm")}
            className={`rounded px-3 py-1 text-sm ${cardSize === "sm" ? "bg-[#2563EB] text-white" : "bg-[#F6F7F9] text-[#475569]"}`}
          >
            작게
          </button>
          <button
            type="button"
            onClick={() => setCardSize("md")}
            className={`rounded px-3 py-1 text-sm ${cardSize === "md" ? "bg-[#2563EB] text-white" : "bg-[#F6F7F9] text-[#475569]"}`}
          >
            기본
          </button>
          <button
            type="button"
            onClick={() => setCardSize("lg")}
            className={`rounded px-3 py-1 text-sm ${cardSize === "lg" ? "bg-[#2563EB] text-white" : "bg-[#F6F7F9] text-[#475569]"}`}
          >
            크게
          </button>
        </div>

        {moviesQuery.isPending ? (
          <div className="flex flex-1 items-center justify-center py-20 text-sm text-[#606774]">
            영화 목록을 불러오는 중이에요.
          </div>
        ) : moviesQuery.isError ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20 text-sm text-red-500">
            <p>영화 목록을 불러오지 못했어요.</p>
            <button
              type="button"
              onClick={handleRetry}
              className="rounded bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1D4ED8]"
            >
              다시 시도
            </button>
          </div>
        ) : movies.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-20 text-sm text-[#606774]">
            조건에 맞는 영화가 없어요.
          </div>
        ) : (
          <>
            <MovieGrid movies={movies} />
            <Pagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>

      <footer className="mt-auto flex min-h-[57px] items-center border-t border-[#E3E6EB] bg-white px-5 py-4 md:px-[80px]">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-end gap-2 text-xs font-normal leading-none text-[#606774]">
          <img
            className="block h-6 w-6"
            src="/images/logos/tmdb-logo.svg"
            alt="TMDB Logo"
          />
          <p>
            This product uses the TMDB API but is not endorsed or certified by{" "}
            <span className="underline decoration-solid">TMDB</span>.
          </p>
        </div>
      </footer>
    </>
  );
}
