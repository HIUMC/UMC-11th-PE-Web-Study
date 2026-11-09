import MovieCard from "./movie-card";
import { movies } from "../../data/movies";
import { useMoviePreferenceStore } from "../../stores/movie-preference-store";

export default function MovieGrid() {
  const sortOption = useMoviePreferenceStore(
    (state) => state.sortOption,
  );

  const sortedMovies =
    sortOption === "title"
      ? [...movies].sort((firstMovie, secondMovie) =>
          firstMovie.title.localeCompare(secondMovie.title, "ko"),
        )
      : movies;

  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {sortedMovies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
        />
      ))}
    </section>
  );
}
