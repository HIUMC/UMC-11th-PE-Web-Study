import { useState } from "react";
import { Header } from "./components/header";

import { MovieGrid } from "./components/movie-grid";
import { movies as initialMovies } from "./data/movies";
import "./App.css";
import { Pagination } from "./components/pagination";

const ITEMS_PER_PAGE = 10; //한페이지당 보여줄 영화 개수를 적음

const categories: CategoryProps[] = [
  { category: "영화" },
  { category: "검색" },
  { category: "내 정보" },
];

export default function App() {
  const [movie, setMovie] = useState(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCategory, setCurrentCategory] = useState("영화");

  const handleToggleBookMark = (movieId: number) => {
    setMovie((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  };

  const totalPages = 5;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentMovies = movie.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="app">
      <Header
        categories={categories}
        currentCat={currentCategory}
        onCategoryChange={setCurrentCategory}
      />
      <div className="movie_body">
        <MovieGrid
          movies={currentMovies}
          onToggleBookMark={handleToggleBookMark}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
