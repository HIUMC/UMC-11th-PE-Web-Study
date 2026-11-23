"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { backdropUrl, getMovies, posterUrl, type Movie } from "../../lib/tmdb";

export default function MovieDetailPage({ params }: PageProps<"/movies/[movieId]">) {
  const { movieId } = use(params);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!/^\d+$/.test(movieId)) { setError("올바른 영화 번호가 아닙니다."); return; }
    getMovies(`movie/${movieId}`)
      .then((data: Movie) => setMovie(data))
      .catch(() => setError("영화 정보를 불러오지 못했습니다."));
  }, [movieId]);

  if (error) return <main className="mx-auto w-[min(1180px,calc(100%-48px))] py-16 text-red-600">{error}</main>;
  if (!movie) return <main className="mx-auto w-[min(1180px,calc(100%-48px))] py-16">영화 정보를 불러오는 중입니다.</main>;
  const poster = posterUrl(movie.poster_path);
  const backdrop = backdropUrl(movie.backdrop_path);

  return <main className="pb-20">
    <section className="relative isolate h-[min(52vw,560px)] min-h-80 overflow-hidden bg-zinc-900 text-white">
      {backdrop && <Image src={backdrop} alt="" fill priority sizes="100vw" className="object-cover opacity-50" />}
      <div className="absolute inset-0 bg-linear-to-t from-zinc-950 to-transparent" />
      <div className="relative mx-auto flex h-full w-[min(1180px,calc(100%-48px))] items-end pb-12"><div><p className="text-sm">{movie.release_date || "개봉일 정보 없음"}</p><h1 className="mt-3 text-4xl font-bold sm:text-5xl">{movie.title}</h1><p className="mt-2 text-zinc-300">{movie.original_title}</p></div></div>
    </section>
    <section className="mx-auto grid w-[min(1180px,calc(100%-48px))] gap-10 pt-12 md:grid-cols-[240px_1fr]">
      {poster ? <div className="relative aspect-[2/3]"><Image src={poster} alt={`${movie.title} 포스터`} fill sizes="240px" className="rounded-xl object-cover shadow-xl" /></div> : <div className="aspect-[2/3] rounded-xl bg-zinc-200" />}
      <div><Link href="/" className="text-sm font-semibold underline">영화 목록으로</Link><h2 className="mt-8 text-lg font-bold">줄거리</h2><p className="mt-3 max-w-2xl leading-8 text-zinc-600">{movie.overview || "줄거리 정보가 없습니다."}</p></div>
    </section>
  </main>;
}
