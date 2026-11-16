import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MovieGrid from "../../components/movies/movie-grid";
import { getMovies } from "../../api/movies/get-movies";
import type { Movie as MovieCardData } from "../../types/movie";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";
import "../../App.css";

function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;
  const firstVisiblePage = Math.max(1, page - 2);
  const lastVisiblePage = Math.min(totalPages, page + 2);
  const visiblePages = Array.from(
    { length: Math.max(0, lastVisiblePage - firstVisiblePage + 1) },
    (_, index) => firstVisiblePage + index,
  );

  const movieCards: MovieCardData[] = movies.flatMap((movie) => {
    if (!movie.poster_path) return [];

    return [
      {
        id: movie.id,
        title: movie.title,
        original_title: movie.original_title,
        release_date: movie.release_date || "개봉일 미정",
        poster_path: getTmdbPosterUrl(movie.poster_path),
        backdrop_path: getTmdbBackdropUrl(movie.backdrop_path),
        genres: [],
        runtime: "",
        tagline: "",
        overview: movie.overview,
        isBookmarked: false,
      },
    ];
  });

  return (
    <main className="flex w-full flex-col items-start gap-5 px-4 py-6 sm:px-8 lg:px-20">
      <h1 className="text-3xl leading-tight font-bold tracking-tight text-text-primary sm:text-4xl">
        영화 목록
      </h1>
      {moviesQuery.isPending ? (
        <p className="text-sm text-text-secondary" role="status">
          영화를 불러오는 중이에요.
        </p>
      ) : moviesQuery.isError ? (
        <p className="text-sm text-text-secondary" role="alert">
          {moviesQuery.error.message}
        </p>
      ) : movies.length === 0 ? (
        <p className="text-sm text-text-secondary">표시할 영화가 없어요.</p>
      ) : (
        <>
          <MovieGrid movies={movieCards} />
          {totalPages > 1 && (
            <nav
              className="flex w-full items-center justify-center gap-2"
              aria-label="영화 목록 페이지"
            >
              <button
                className="rounded-md border border-border-default px-3 py-2 text-sm text-text-secondary disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                disabled={page === 1}
                onClick={() => setPage((currentPage) => currentPage - 1)}
              >
                이전
              </button>
              {visiblePages.map((pageNumber) => (
                <button
                  className={`min-w-10 rounded-md border px-3 py-2 text-sm ${
                    pageNumber === page
                      ? "border-action-primary bg-action-primary text-bg-surface"
                      : "border-border-default text-text-secondary"
                  }`}
                  key={pageNumber}
                  type="button"
                  aria-current={pageNumber === page ? "page" : undefined}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                className="rounded-md border border-border-default px-3 py-2 text-sm text-text-secondary disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((currentPage) => currentPage + 1)}
              >
                다음
              </button>
            </nav>
          )}
        </>
      )}
    </main>
  );
}

export default MovieListPage;
