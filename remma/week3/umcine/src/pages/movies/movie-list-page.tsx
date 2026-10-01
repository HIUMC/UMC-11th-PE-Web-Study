import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import { dummyMovies } from "../../data/movie_data";

export default function MovieListPage() {
  const [movieList, setMovieList] = useState(dummyMovies);

  const handleToggleBookmark = (id: number) => {
    setMovieList((prevList) =>
      prevList.map((movie) =>
        movie.id === id ? { ...movie, isBookmarked: !movie.isBookmarked } : movie
      )
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
      <h1 className="mb-6 text-2xl font-extrabold text-gray-950">영화 목록</h1>
      <MovieGrid movies={movieList} onToggleBookmark={handleToggleBookmark} />
    </div>
  );
}