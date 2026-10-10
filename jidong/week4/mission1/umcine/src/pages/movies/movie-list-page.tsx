import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies } from "../../data/movies";

export function MovieListPage() {
  return (
    <main className="mx-auto max-w-[1200px] px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold">영화 목록</h1>
      <MovieGrid movies={movies} />
      <Pagination />
    </main>
  );
}
