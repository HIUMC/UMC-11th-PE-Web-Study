import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import type { SubmitEvent } from "react";
import { useEffect, useState } from "react";
import { searchMovies } from "../../api/movies/search-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import BookmarkButton from "../../components/movies/bookmark-button";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const normalizedQuery = query?.trim() ?? "";

  useEffect(() => {
    let ignore = false;
    if (!normalizedQuery) return () => { ignore = true; };
    void Promise.resolve().then(() => {
      if (!ignore) { setMovies([]); setErrorMessage(null); setIsLoading(true); }
      return searchMovies({ query: normalizedQuery });
    }).then((response) => { if (!ignore) setMovies(response.results); }).catch(() => { if (!ignore) setErrorMessage("검색 결과를 불러오지 못했어요."); }).finally(() => { if (!ignore) setIsLoading(false); });
    return () => { ignore = true; };
  }, [normalizedQuery]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) { event.preventDefault(); const nextQuery = new FormData(event.currentTarget).get("query")?.toString().trim() ?? ""; navigate({ search: nextQuery ? { query: nextQuery } : {} }); }

  return <main className="mx-auto w-[min(960px,calc(100%-48px))] py-16"><p className="text-xs font-bold tracking-[0.13em] text-zinc-400">SEARCH MOVIES</p><h1 className="mt-2 text-[34px] font-bold tracking-[-1.5px] text-zinc-950">영화 검색</h1><form key={query ?? ""} onSubmit={handleSubmit} className="mt-8 flex gap-2"><input name="query" aria-label="검색어" placeholder="영화 제목을 입력하세요" className="min-w-0 flex-1 rounded-lg border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200" defaultValue={query ?? ""} /><button type="submit" className="rounded-lg bg-zinc-900 px-5 py-3 font-semibold text-white transition hover:bg-zinc-700">검색</button></form>{!normalizedQuery ? <p className="mt-10 text-zinc-500">검색어를 입력해 주세요.</p> : isLoading ? <p className="mt-10 text-zinc-500">검색 결과를 불러오는 중이에요.</p> : errorMessage ? <p className="mt-10 text-red-600">{errorMessage}</p> : movies.length === 0 ? <p className="mt-10 text-zinc-500">조건에 맞는 영화가 없어요.</p> : <section className="mt-10"><h2 className="text-xl font-bold text-zinc-900">“{query}” 검색 결과</h2><p className="mt-2 text-zinc-500">영화 {movies.length}편</p><ul className="mt-6 space-y-5">{movies.map((movie) => { const posterUrl = getTmdbPosterUrl(movie.poster_path); return <li key={movie.id} className="flex gap-4 border-b border-zinc-200 pb-5"><Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="grid h-36 w-24 shrink-0 place-items-center overflow-hidden rounded bg-zinc-200 text-xs text-zinc-500">{posterUrl ? <img src={posterUrl} alt={`${movie.title} 포스터`} className="size-full object-cover" /> : "이미지 없음"}</Link><div className="min-w-0 flex-1"><Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="font-bold text-zinc-900 hover:underline">{movie.title}</Link><p className="mt-1 text-sm text-zinc-500">{movie.original_title}</p><p className="mt-2 text-sm text-zinc-600">{movie.release_date || "개봉일 정보 없음"}</p><p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">{movie.overview}</p><BookmarkButton movieId={movie.id} movieTitle={movie.title} className="mt-4" /></div></li>; })}</ul></section>}</main>;
}
