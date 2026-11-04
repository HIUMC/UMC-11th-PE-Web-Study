import MovieGrid from "../../components/movie-grid";
import { movies } from "../../data/movies";

export function MovieListPage() {
  return (
    <main className="main">
      <h1>영화 목록</h1>
      <MovieGrid movies={movies} />
    </main>
  );
}