import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import BookmarkButton from "../../components/movies/bookmark-button";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

function formatRuntime(runtime: number | null) { if (runtime === null) return "상영 시간 정보가 없어요."; return `${Math.floor(runtime / 60)}시간 ${runtime % 60}분`; }

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;
  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  useEffect(() => {
    let ignore = false;
    if (!isValidMovieId) return () => { ignore = true; };
    void Promise.resolve().then(() => {
      if (!ignore) { setMovie(null); setErrorMessage(null); setIsLoading(true); }
      return getMovieDetail(parsedMovieId);
    }).then((response) => { if (!ignore) setMovie(response); }).catch((error: unknown) => { if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error)); }).finally(() => { if (!ignore) setIsLoading(false); });
    return () => { ignore = true; };
  }, [isValidMovieId, parsedMovieId]);
  if (!isValidMovieId) return <main className="mx-auto w-[min(1180px,calc(100%-48px))] py-16 text-zinc-600">올바르지 않은 영화 번호예요.</main>;
  if (isLoading) return <main className="mx-auto w-[min(1180px,calc(100%-48px))] py-16 text-zinc-600">영화 정보를 불러오는 중이에요.</main>;
  if (errorMessage) return <main className="mx-auto w-[min(1180px,calc(100%-48px))] py-16 text-red-600">{errorMessage}</main>;
  if (!movie) return null;
  const posterUrl = getTmdbPosterUrl(movie.poster_path); const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  return <main className="pb-20"><section className="relative isolate h-[min(52vw,560px)] min-h-80 overflow-hidden bg-zinc-900">{backdropUrl ? <img src={backdropUrl} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover opacity-60" /> : <div className="absolute inset-0 bg-zinc-800" />}<div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/30 to-transparent" /><div className="relative mx-auto flex h-full w-[min(1180px,calc(100%-48px))] items-end pb-12"><div className="max-w-2xl text-white"><p className="text-sm font-medium text-zinc-200">{movie.release_date || "개봉일 정보 없음"} · {formatRuntime(movie.runtime)}</p><h1 className="mt-3 text-4xl font-bold tracking-[-1.8px] sm:text-5xl">{movie.title}</h1><p className="mt-2 text-lg text-zinc-300">{movie.original_title}</p><div className="mt-5 flex flex-wrap gap-2">{movie.genres.map((genre) => <span key={genre.id} className="rounded-full border border-white/40 px-3 py-1 text-sm">{genre.name}</span>)}</div></div></div></section><section className="mx-auto grid w-[min(1180px,calc(100%-48px))] gap-10 pt-12 md:grid-cols-[240px_1fr]"><div className="grid aspect-[2/3] w-full max-w-60 place-items-center overflow-hidden rounded-xl bg-zinc-200 text-sm text-zinc-500 shadow-xl">{posterUrl ? <img src={posterUrl} alt={`${movie.title} 포스터`} className="size-full object-cover" /> : "이미지 없음"}</div><div><Link to="/" className="text-sm font-semibold text-zinc-600 underline underline-offset-4">영화 목록으로</Link><BookmarkButton movieId={movie.id} movieTitle={movie.title} className="ml-4" />{movie.tagline && <p className="mt-8 text-xl font-bold tracking-[-0.5px] text-zinc-900">{movie.tagline}</p>}<h2 className="mt-8 text-lg font-bold text-zinc-900">줄거리</h2><p className="mt-3 max-w-2xl leading-8 text-zinc-600">{movie.overview || "줄거리 정보가 없어요."}</p><dl className="mt-9 grid max-w-xl grid-cols-[100px_1fr] gap-y-3 border-t border-zinc-200 pt-6 text-sm"><dt className="font-semibold text-zinc-900">개봉일</dt><dd className="text-zinc-600">{movie.release_date || "정보 없음"}</dd><dt className="font-semibold text-zinc-900">장르</dt><dd className="text-zinc-600">{movie.genres.map((genre) => genre.name).join(", ") || "정보 없음"}</dd><dt className="font-semibold text-zinc-900">상영 시간</dt><dd className="text-zinc-600">{formatRuntime(movie.runtime)}</dd></dl></div></section></main>;
}
