import MovieGrid from "./components/movies/movie-grid";
import { movies } from "./data/movies";

export default function App() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-8 py-9 lg:px-12 lg:py-10">
      <h1 className="mb-6 text-4xl font-bold tracking-[-0.04em]">영화 목록</h1>
      <MovieGrid movies={movies} />
    </main>
  );
}
