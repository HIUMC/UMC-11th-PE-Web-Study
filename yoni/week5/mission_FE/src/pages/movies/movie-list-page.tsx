import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";

export function MovieListPage() {
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: 1 });
        if (!ignore) setMovies(response.results);
      } catch {
        if (!ignore) {
          setErrorMessage("영화 목록을 불러오지 못했어요.");
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, []);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 pt-6 pb-20 sm:px-6 md:px-10 xl:px-[80px]">
      <h1 className="mb-[20px] text-left text-[30px] leading-[1.3] font-bold text-[#1f1f1f]">
        영화 목록
      </h1>
      {isLoading ? (
        <p>영화 목록을 불러오는 중이에요.</p>
      ) : errorMessage ? (
        <p role="alert">{errorMessage}</p>
      ) : movies.length === 0 ? (
        <p>조건에 맞는 영화가 없어요.</p>
      ) : (
        <MovieGrid
          movies={movies}
          bookmarkedMovieIds={bookmarkedMovieIds}
          onToggleBookmark={toggleBookmark}
        />
      )}

      <Pagination />
    </main>
  );
}
