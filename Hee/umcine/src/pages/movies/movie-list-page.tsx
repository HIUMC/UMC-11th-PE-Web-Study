import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import type { Movie } from "../../types/movie";
import { adaptTmdbMovie } from "../../utils/movies/adapt-tmdb-movie";

export default function MovieListPage() {
  const { page } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const currentPage = page ?? 1;
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: currentPage });
        if (!ignore) {
          setMovies(response.results.map(adaptTmdbMovie));
          setTotalPages(Math.min(response.total_pages, 500));
        }
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, [currentPage, retryCount]);

  function handlePageChange(nextPage: number) {
    navigate({
      search: nextPage === 1 ? {} : { page: nextPage },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-[#F7F8FA]">
      <div className="mx-auto max-w-[1100px] px-5 py-6">
        <h1 className="mb-5 text-[28px] font-bold text-[#191D23]">영화 목록</h1>
        {isLoading ? (
          <p className="py-24 text-center text-sm text-[#68707C]">영화 목록을 불러오는 중이에요.</p>
        ) : errorMessage ? (
          <div className="py-24 text-center">
            <p className="text-sm text-[#D14343]">{errorMessage}</p>
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-4 rounded-lg bg-[#191D23] px-4 py-2 text-sm font-semibold text-white"
            >
              다시 시도
            </button>
          </div>
        ) : movies.length === 0 ? (
          <p className="py-24 text-center text-sm text-[#68707C]">표시할 영화가 없어요.</p>
        ) : (
          <MovieGrid movies={movies} />
        )}
        {!isLoading && !errorMessage && movies.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </main>
  );
}
