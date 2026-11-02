import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page: currentPage }],
    queryFn: () => getMovies({ page: currentPage }),
  });
  const movies = moviesQuery.data?.results ?? [];

  return <main className="mx-auto w-[min(1180px,calc(100%-48px))] py-16 pb-20" id="movies"><div className="mb-8 flex items-end justify-between gap-6"><div><p className="mb-2 text-xs font-bold tracking-[0.13em] text-zinc-400">UMCINE COLLECTION</p><h1 className="text-[34px] font-bold tracking-[-1.5px] text-zinc-950">영화 목록</h1></div><p className="mb-1 text-sm text-zinc-400">총 {movies.length}편</p></div>{moviesQuery.isPending ? <p className="py-20 text-center text-zinc-500">영화 목록을 불러오는 중이에요.</p> : moviesQuery.isError ? <p className="py-20 text-center text-red-600">{moviesQuery.error.message}</p> : movies.length === 0 ? <p className="py-20 text-center text-zinc-500">표시할 영화가 없어요.</p> : <MovieGrid movies={movies} />}<Pagination currentPage={currentPage} onPageChange={setCurrentPage} /><div className="mt-10 flex items-center justify-center gap-3 text-xs text-zinc-400"><span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span><img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="h-4" /></div></main>;
}
