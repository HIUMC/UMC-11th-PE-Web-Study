import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbImageUrl } from "../../utils/movies/tmdb-image";
import { getGenreNames } from "../../utils/movies/tmdb-genres";
import MovieGrid from "./movie-grid";
import Pagination from "./pagination";
import type { Movie } from "../../types/movie";

// MovieGrid는 기존 Movie 타입을 받으므로 TMDB 응답을 맞춰 변환해요.
function toMovie(movie: TmdbMovieListItem, isBookmarked: boolean): Movie {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: movie.release_date,
    posterPath: getTmdbImageUrl(movie.poster_path),
    backdropPath: getTmdbImageUrl(movie.backdrop_path, "original"),
    genres: getGenreNames(movie.genre_ids),
    runtime: "",
    tagline: "",
    overview: movie.overview,
    isBookmarked,
  };
}

interface MovieListResult {
  page: number;
  movies: TmdbMovieListItem[];
  errorMessage: string | null;
}

function MovieListPage() {
  const [result, setResult] = useState<MovieListResult | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let ignore = false;

    getMovies({ page: currentPage })
      .then((response) => {
        if (!ignore) setResult({ page: currentPage, movies: response.results, errorMessage: null });
      })
      .catch(() => {
        if (!ignore) setResult({ page: currentPage, movies: [], errorMessage: "영화 목록을 불러오지 못했어요." });
      });

    return () => {
      ignore = true;
    };
  }, [currentPage]);

  // 현재 페이지에 대한 응답이 아직 없으면 로딩 중이에요.
  const isCurrentResult = result?.page === currentPage;
  const movies = isCurrentResult ? result.movies : [];
  const errorMessage = isCurrentResult ? result.errorMessage : null;
  const isLoading = !isCurrentResult;

  const toggleBookmark = (movieId: number) => {
    setBookmarkedIds((currentIds) =>
      currentIds.includes(movieId)
        ? currentIds.filter((id) => id !== movieId)
        : [...currentIds, movieId],
    );
  };

  const gridMovies = movies.map((movie) => toMovie(movie, bookmarkedIds.includes(movie.id)));

  return (
    <main className="page-content">
      <section className="page-heading" aria-labelledby="movie-list-title">
        <div>
          <p className="eyebrow">UMCINE MOVIES</p>
          <h1 id="movie-list-title">영화 목록</h1>
          <p className="page-description">지금 가장 보고 싶은 영화를 찾아보세요.</p>
        </div>
        <p className="movie-count">
          <strong>{movies.length}</strong> movies
        </p>
      </section>
      {isLoading ? (
        <p className="search-empty">영화 목록을 불러오는 중이에요...</p>
      ) : errorMessage ? (
        <p className="search-empty">{errorMessage}</p>
      ) : (
        <MovieGrid movies={gridMovies} onToggleBookmark={toggleBookmark} />
      )}
      <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
    </main>
  );
}

export default MovieListPage;
