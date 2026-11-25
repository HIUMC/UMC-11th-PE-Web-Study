import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/lib/types";
import BookmarkButton from "./bookmark-button";

export default function MovieCard({movie}:{movie:Movie}) { return <article>
  <div className="relative aspect-[205/232] overflow-hidden rounded-lg bg-gray-200">
    <Link href={`/movies/${movie.id}`} className="block h-full">{movie.posterPath?<Image src={movie.posterPath} alt={`${movie.title} 포스터`} fill sizes="(max-width: 640px) 100vw, 205px" className="object-cover"/>:<span className="flex h-full items-center justify-center text-xs text-gray-500">포스터 없음</span>}</Link>
    <BookmarkButton movieId={movie.id} compact />
  </div>
  <Link href={`/movies/${movie.id}`}><h2 className="mt-2 text-sm font-semibold">{movie.title}</h2></Link>
  <p className="mt-0.5 text-xs text-gray-400">{movie.releaseDate||"개봉일 정보 없음"}</p>
  </article>; }
