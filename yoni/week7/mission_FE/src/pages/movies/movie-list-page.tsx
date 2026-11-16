import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import { useQuery } from "@tanstack/react-query";

export function MovieListPage() {
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const [page, setPage] = useState(1);
  const pageSize = 8;

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page, pageSize }],
    queryFn: async () => {
      // TMDB returns 20 movies per API page; display 8 per screen.
      const apiPageSize = 20;
      const start = (page - 1) * pageSize;
      const firstApiPage = Math.floor(start / apiPageSize) + 1;
      const lastApiPage = Math.floor((start + pageSize - 1) / apiPageSize) + 1;
      const responses = await Promise.all(
        Array.from(
          { length: lastApiPage - firstApiPage + 1 },
          (_, index) => getMovies({ page: firstApiPage + index }),
        ),
      );
      const offset = start % apiPageSize;
      return {
        results: responses.flatMap((response) => response.results)
          .slice(offset, offset + pageSize),
        // TMDB exposes at most 500 API pages.
        totalPages: Math.ceil(
          Math.min(responses[0].total_results, 500 * apiPageSize) / pageSize,
        ),
      };
    },
  });

  const movies = moviesQuery.data?.results ?? [];

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 pt-6 pb-20 sm:px-6 md:px-10 xl:px-[80px]">
      <h1 className="mb-[20px] text-left text-[30px] leading-[1.3] font-bold text-[#1f1f1f]">
        영화 목록
      </h1>

      {moviesQuery.isPending ? (
        <p>영화 목록을 불러오는 중이에요.</p>
      ) : moviesQuery.isError ? (
        <p role="alert">{moviesQuery.error.message}</p>
      ) : movies.length === 0 ? (
        <p>조건에 맞는 영화가 없어요.</p>
      ) : (
        <MovieGrid
          movies={movies}
          bookmarkedMovieIds={bookmarkedMovieIds}
          onToggleBookmark={toggleBookmark}
        />
      )}

      {moviesQuery.isSuccess && movies.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={moviesQuery.data.totalPages}
          onPageChange={setPage}
        />
      )}
    </main>
  );
}
