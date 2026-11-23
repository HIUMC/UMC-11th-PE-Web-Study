"use client";

import { useEffect, useState } from "react";
import MovieCard from "./movie-card";
import { getMovies, type MovieListResponse } from "../lib/tmdb";

export default function MovieList() {
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<MovieListResponse["results"]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setError("");
    getMovies("movie/popular", new URLSearchParams({ page: String(page) }))
      .then((data: MovieListResponse) => active && setMovies(data.results))
      .catch(() => active && setError("영화 목록을 불러오지 못했습니다."));
    return () => { active = false; };
  }, [page]);

  return (
    <main className="mx-auto w-[min(1180px,calc(100%-48px))] py-16 pb-20">
      <p className="mb-2 text-xs font-bold tracking-[0.13em] text-zinc-400">UMCINE COLLECTION</p>
      <h1 className="mb-8 text-[34px] font-bold tracking-[-1.5px] text-zinc-950">영화 목록</h1>
      {error ? <p className="py-20 text-center text-red-600">{error}</p> : movies.length === 0 ? <p className="py-20 text-center text-zinc-500">영화 목록을 불러오는 중입니다.</p> : <section className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}</section>}
      <nav className="mt-14 flex justify-center gap-2" aria-label="페이지 이동">
        {[1, 2, 3, 4, 5].map((nextPage) => <button key={nextPage} onClick={() => setPage(nextPage)} className={`grid size-10 place-items-center rounded-full ${page === nextPage ? "bg-zinc-900 text-white" : "hover:bg-zinc-100"}`}>{nextPage}</button>)}
      </nav>
    </main>
  );
}
