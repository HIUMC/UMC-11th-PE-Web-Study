import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movies/movie-grid";

export function MovieListPage() {
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

        if (!ignore) {
          setMovies(response.results);
        }
      } catch {
        if (!ignore) {
          setErrorMessage("영화 목록을 불러오지 못했어요.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-[1280px] flex-1 pb-24 pt-6">
        <h1 className="mb-5 text-[32px] font-bold tracking-tight">
          영화 목록
        </h1>

        {isLoading ? (
          <p className="py-16 text-center text-text-sub">
            영화 목록을 불러오는 중이에요.
          </p>
        ) : errorMessage ? (
          <p className="py-16 text-center text-text-sub">
            {errorMessage}
          </p>
        ) : movies.length === 0 ? (
          <p className="py-16 text-center text-text-sub">
            조건에 맞는 영화가 없어요.
          </p>
        ) : (
          <MovieGrid movies={movies} />
        )}

        {/* <Pagination currentPage={1} totalPages={1} /> */}
      </main>

      <footer className="border-t border-border bg-surface">
        <p className="mx-auto max-w-[1280px] py-5 text-right text-xs text-text-sub">
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a
            className="underline"
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noreferrer"
          >
            TMDB
          </a>
          .
        </p>
      </footer>
    </div>
  );
}