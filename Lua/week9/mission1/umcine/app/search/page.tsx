"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { getMovies, posterUrl, type MovieListResponse } from "../lib/tmdb";

export default function SearchPage() {
  return (
    <Suspense fallback={<main className="mx-auto w-[min(960px,calc(100%-48px))] py-16">검색 화면을 준비하는 중입니다.</main>}>
      <SearchScreen />
    </Suspense>
  );
}

function SearchScreen() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("query")?.trim() ?? "";
  const [movies, setMovies] = useState<MovieListResponse["results"]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) { setMovies([]); return; }
    getMovies("search/movie", new URLSearchParams({ query }))
      .then((data: MovieListResponse) => setMovies(data.results))
      .catch(() => setError("검색 결과를 불러오지 못했습니다."));
  }, [query]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("query")?.toString().trim();
    router.push(value ? `/search?query=${encodeURIComponent(value)}` : "/search");
  }

  return <main className="mx-auto w-[min(960px,calc(100%-48px))] py-16"><p className="text-xs font-bold tracking-[0.13em] text-zinc-400">SEARCH MOVIES</p><h1 className="mt-2 text-[34px] font-bold">영화 검색</h1><form onSubmit={submit} className="mt-8 flex gap-2"><input name="query" defaultValue={query} placeholder="영화 제목을 입력하세요" className="min-w-0 flex-1 rounded-lg border border-zinc-300 px-4 py-3" /><button className="rounded-lg bg-zinc-900 px-5 py-3 font-semibold text-white">검색</button></form>{error ? <p className="mt-10 text-red-600">{error}</p> : !query ? <p className="mt-10 text-zinc-500">검색어를 입력해 주세요.</p> : <ul className="mt-10 space-y-5">{movies.map((movie) => <li key={movie.id} className="flex gap-4 border-b border-zinc-200 pb-5"><Link href={`/movies/${movie.id}`} className="grid h-36 w-24 shrink-0 place-items-center overflow-hidden rounded bg-zinc-200">{posterUrl(movie.poster_path) ? <img src={posterUrl(movie.poster_path)!} alt={`${movie.title} 포스터`} className="size-full object-cover" /> : "이미지 없음"}</Link><div><Link href={`/movies/${movie.id}`} className="font-bold hover:underline">{movie.title}</Link><p className="mt-1 text-sm text-zinc-500">{movie.original_title}</p><p className="mt-2 line-clamp-2 text-sm text-zinc-600">{movie.overview}</p></div></li>)}</ul>}</main>;
}
