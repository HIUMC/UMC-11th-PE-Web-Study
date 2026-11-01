
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { adaptTmdbMovie } from "../../utils/movies/adapt-tmdb-movie";

export default function MovieListPage() {
  const { page } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const currentPage = page ?? 1;

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page: currentPage }],
    queryFn: () => getMovies({ page: currentPage }),
  });

  const movies =
    moviesQuery.data?.results.map(adaptTmdbMovie) ?? [];

  const totalPages = Math.min(
    moviesQuery.data?.total_pages ?? 1,
    500
  );

  function handlePageChange(nextPage: number) {
    navigate({
      search: nextPage === 1 ? {} : { page: nextPage },
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-[#F7F8FA]">
      <div className="mx-auto max-w-[1100px] px-5 py-6">
        <h1 className="mb-5 text-[28px] font-bold text-[#191D23]">
          영화 목록
        </h1>

        {moviesQuery.isPending ? (
          <p className="py-24 text-center text-sm text-[#68707C]">
            영화 목록을 불러오는 중이에요.
          </p>
        ) : moviesQuery.isError ? (
          <div className="py-24 text-center">
            <p className="text-sm text-[#D14343]">
              영화 목록을 불러오지 못했어요.
            </p>
            <button
              type="button"
              onClick={() => moviesQuery.refetch()}
              className="mt-4 rounded-lg bg-[#191D23] px-4 py-2 text-sm font-semibold text-white"
            >
              다시 시도
            </button>
          </div>
        ) : movies.length === 0 ? (
          <p className="py-24 text-center text-sm text-[#68707C]">
            표시할 영화가 없어요.
          </p>
        ) : (
          <MovieGrid movies={movies} />
        )}

        {!moviesQuery.isPending &&
          !moviesQuery.isError &&
          movies.length > 0 && (
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
