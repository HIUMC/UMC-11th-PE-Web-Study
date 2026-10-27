import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

interface MovieCardProps { movie: TmdbMovieListItem; }

export default function MovieCard({ movie }: MovieCardProps) {
  const isBookmarked = useBookmarkStore((state) => state.bookmarkedMovieIds.includes(movie.id));
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  return <article className="min-w-0"><div className="relative aspect-[2/3] overflow-hidden rounded-[10px] bg-zinc-200 shadow-[0_8px_22px_rgba(0,0,0,0.08)]"><Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} aria-label={`${movie.title} 상세 보기`}>{posterUrl ? <img className="size-full object-cover transition-transform duration-200 hover:scale-[1.025]" src={posterUrl} alt={`${movie.title} 포스터`} /> : <div className="grid size-full place-items-center text-sm text-zinc-500">이미지 없음</div>}</Link><button className={cn("absolute right-3 top-3 grid size-[38px] place-items-center rounded-full bg-white/90 shadow-md transition hover:-translate-y-0.5 hover:bg-white", isBookmarked && "bg-blue-50")} type="button" aria-label={isBookmarked ? `${movie.title} 북마크 해제` : `${movie.title} 북마크 추가`} aria-pressed={isBookmarked} onClick={() => toggleBookmark(movie.id)}><img src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"} alt="" className="size-[19px]" /></button></div><div className="pt-3.5"><Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="block truncate text-base leading-[1.35] font-bold tracking-[-0.45px] text-zinc-900">{movie.title}</Link><p className="mt-1 truncate text-xs text-zinc-400">{movie.original_title}</p><p className="mt-2 text-xs text-zinc-600">{movie.release_date || "개봉일 정보 없음"}</p></div></article>;
}
