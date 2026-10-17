import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function MovieListPage() {
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const movies = initialMovies.map((movie) => ({
    ...movie,
    isBookmarked: bookmarkedMovieIds.includes(movie.id),
  }));

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 pt-6 pb-20 sm:px-6 md:px-10 xl:px-[80px]">
      <h1 className="mb-[20px] text-left text-[30px] leading-[1.3] font-bold text-[#1f1f1f]">
        영화 목록
      </h1>

      <MovieGrid movies={movies} onToggleBookmark={toggleBookmark} />

      <Pagination />
    </main>
  );
}
