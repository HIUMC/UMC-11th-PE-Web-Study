import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  useEffect(() => { let ignore = false; async function loadMovies() { setIsLoading(true); setErrorMessage(null); try { const response = await getMovies({ page: currentPage }); if (!ignore) setMovies(response.results); } catch { if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요."); } finally { if (!ignore) setIsLoading(false); } } loadMovies(); return () => { ignore = true; }; }, [currentPage]);
  return <main className="mx-auto w-[min(1180px,calc(100%-48px))] py-16 pb-20" id="movies"><div className="mb-8 flex items-end justify-between gap-6"><div><p className="mb-2 text-xs font-bold tracking-[0.13em] text-zinc-400">UMCINE COLLECTION</p><h1 className="text-[34px] font-bold tracking-[-1.5px] text-zinc-950">영화 목록</h1></div><p className="mb-1 text-sm text-zinc-400">총 {movies.length}편</p></div>{isLoading ? <p className="py-20 text-center text-zinc-500">영화 목록을 불러오는 중이에요.</p> : errorMessage ? <p className="py-20 text-center text-red-600">{errorMessage}</p> : movies.length === 0 ? <p className="py-20 text-center text-zinc-500">표시할 영화가 없어요.</p> : <MovieGrid movies={movies} />}<Pagination currentPage={currentPage} onPageChange={setCurrentPage} /><div className="mt-10 flex items-center justify-center gap-3 text-xs text-zinc-400"><span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span><img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="h-4" /></div></main>;
}
