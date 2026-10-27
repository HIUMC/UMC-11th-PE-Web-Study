import { createFileRoute } from "@tanstack/react-router";
import { MovieListPage } from "../pages/movies/movie-list-page";

export const Route = createFileRoute("/")({
  // URL의 ?page=2를 숫자로 읽기
  validateSearch: (search: Record<string, unknown>): { page: number } => {
    const page = Number(search.page);

    return {
      page: Number.isSafeInteger(page) && page >= 1 && page <= 500 ? page : 1,
    };
  },
  component: () => (
    <>
      <MovieListPage />
      <footer className="mt-8 flex items-center justify-end gap-2 bg-white px-4 py-6 text-xs text-gray-500">
        <img
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB"
          className="w-12 shrink-0"
        />
        <p>
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>
      </footer>
    </>
  ),
});
