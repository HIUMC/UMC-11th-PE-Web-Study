"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Movie } from "../lib/tmdb";
import { posterUrl } from "../lib/tmdb";

const bookmarkStorageKey = "umcine-bookmarks";

export default function MovieCard({ movie }: { movie: Movie }) {
  const [bookmarked, setBookmarked] = useState(false);
  const poster = posterUrl(movie.poster_path);

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem(bookmarkStorageKey) ?? "[]") as number[];
    setBookmarked(ids.includes(movie.id));
  }, [movie.id]);

  function toggleBookmark() {
    setBookmarked((current) => {
      const ids = JSON.parse(localStorage.getItem(bookmarkStorageKey) ?? "[]") as number[];
      const nextIds = current ? ids.filter((id) => id !== movie.id) : [...ids, movie.id];
      localStorage.setItem(bookmarkStorageKey, JSON.stringify(nextIds));
      return !current;
    });
  }

  return (
    <article className="min-w-0">
      <div className="relative aspect-[2/3] overflow-hidden rounded-[10px] bg-zinc-200 shadow-[0_8px_22px_rgba(0,0,0,0.08)]">
        <Link href={`/movies/${movie.id}`} aria-label={`${movie.title} 상세 보기`} className="absolute inset-0">
          {poster ? <Image src={poster} alt={`${movie.title} 포스터`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw" className="object-cover transition-transform duration-200 hover:scale-[1.025]" /> : <span className="grid size-full place-items-center text-sm text-zinc-500">이미지 없음</span>}
        </Link>
        <button onClick={toggleBookmark} type="button" aria-pressed={bookmarked} className="absolute right-3 top-3 grid size-[38px] place-items-center rounded-full bg-white/90 shadow-md" >
          {bookmarked ? "★" : "☆"}
        </button>
      </div>
      <div className="pt-3.5">
        <Link href={`/movies/${movie.id}`} className="block truncate text-base font-bold text-zinc-900">{movie.title}</Link>
        <p className="mt-1 truncate text-xs text-zinc-400">{movie.original_title}</p>
        <p className="mt-2 text-xs text-zinc-600">{movie.release_date || "개봉일 정보 없음"}</p>
      </div>
    </article>
  );
}
