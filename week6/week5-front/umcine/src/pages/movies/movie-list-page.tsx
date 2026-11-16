import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import type { Movie } from "../../types/movie";
import { getGenreNames } from "../../utils/movies/tmdb-genres";
import { getTmdbImageUrl } from "../../utils/movies/tmdb-image";

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

function MovieListPage() {
  const [page, setPage] = useState(1);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  // TMDB는 500페이지까지만 조회할 수 있어요.
  const totalPages = Math.min(moviesQuery.data?.total_pages ?? 0, 500);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

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

      {/* 데이터를 가져오는 중인지, 오류가 발생했는지 순서대로 확인해요. */}
      {moviesQuery.isPending ? (
        <p className="search-empty">영화 목록을 불러오는 중이에요...</p>
      ) : moviesQuery.isError ? (
        <p className="search-empty">영화 목록을 불러오지 못했어요. ({moviesQuery.error.message})</p>
      ) : movies.length === 0 ? (
        <p className="search-empty">표시할 영화가 없어요.</p>
      ) : (
        <>
          <MovieGrid movies={gridMovies} onToggleBookmark={toggleBookmark} />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </main>
  );
}

export default MovieListPage;
