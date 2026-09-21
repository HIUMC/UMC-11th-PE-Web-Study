import { useState } from "react";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";
import { movies as initialMovies } from "./data/movies";
import "./App.css";
export default function App() { const [movies, setMovies] = useState(initialMovies); const [currentPage, setCurrentPage] = useState(1); function handleToggleBookmark(movieId: number) { setMovies((currentMovies) => currentMovies.map((movie) => movie.id === movieId ? { ...movie, isBookmarked: !movie.isBookmarked } : movie)); } return <div className="app-shell"><Header /><main className="page-content" id="movies"><div className="page-heading"><div><p className="eyebrow">UMCINE COLLECTION</p><h1>영화 목록</h1></div><p className="movie-count">총 {movies.length}편</p></div><MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} /><Pagination currentPage={currentPage} onPageChange={setCurrentPage} /></main></div>; }
