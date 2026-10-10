import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies } from "../../data/movies";

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return <main className="mx-auto w-[min(1180px,calc(100%-48px))] py-16 pb-20" id="movies"><div className="mb-8 flex items-end justify-between gap-6"><div><p className="mb-2 text-xs font-bold tracking-[0.13em] text-zinc-400">UMCINE COLLECTION</p><h1 className="text-[34px] font-bold tracking-[-1.5px] text-zinc-950">영화 목록</h1></div><p className="mb-1 text-sm text-zinc-400">총 {movies.length}편</p></div><MovieGrid movies={movies} /><Pagination currentPage={currentPage} onPageChange={setCurrentPage} /></main>;
}
