import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies } from "../../data/movies";

export function MovieListPage() {
  return (
    <main className="px-20 pb-10 pt-8 max-[560px]:px-5">
      <h1 className="mb-6 text-[32px] font-bold text-ink">영화 목록</h1>
      <MovieGrid movies={movies} />
      <Pagination />
    </main>
  );
}