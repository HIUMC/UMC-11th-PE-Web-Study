import MovieGrid from "../../components/movies/movie-grid";
import { dummyMovies } from "../../data/movie_data";

export default function MovieListPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
      <h1 className="mb-6 text-2xl font-extrabold text-gray-950">영화 목록</h1>
      <MovieGrid movies={dummyMovies} />
    </div>
  );
}