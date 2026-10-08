import MovieGrid from "../../components/movies/movie-grid";
import { initialMovies } from "../../data/movies";
import "../../App.css";

function MovieListPage() {
  return (
    <main className="flex w-full flex-col items-start gap-5 px-4 py-6 sm:px-8 lg:px-20">
      <h1 className="text-3xl leading-tight font-bold tracking-tight text-text-primary sm:text-4xl">
        영화 목록
      </h1>
      <MovieGrid movies={initialMovies} />
    </main>
  );
}

export default MovieListPage;