import { useSyncExternalStore } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
import type { Movie } from "../../types/movie";

// ── 북마크 상태 관리 (모듈 스코프에서 공유) ──────────────
const STORAGE_KEY = "umcine-bookmarks";

function readBookmarks(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

let bookmarkedIds: number[] = readBookmarks();
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return bookmarkedIds;
}

export function toggleBookmark(movieId: number) {
  bookmarkedIds = bookmarkedIds.includes(movieId)
    ? bookmarkedIds.filter((id) => id !== movieId)
    : [...bookmarkedIds, movieId];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarkedIds));
  notify();
}

export function useBookmarkedIds() {
  return useSyncExternalStore(subscribe, getSnapshot, () => []);
}

// ── 컴포넌트 ──────────────────────────────────────
interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const bookmarkedIds = useBookmarkedIds();
  const bookmarked = bookmarkedIds.includes(movie.id);

  return (
    <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="block min-w-0">
      <div className="relative aspect-[200/228] w-full overflow-hidden rounded-lg">
        <img src={movie.posterPath} alt={movie.title} className="block h-full w-full object-cover" />

        <button
          type="button"
          aria-pressed={bookmarked}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleBookmark(movie.id);
          }}
          className={cn(
            "absolute right-[9px] top-[9px] flex h-[31px] w-[31px] cursor-pointer items-center justify-center rounded-md border p-0 hover:opacity-90",
            bookmarked ? "border-[#2563eb] bg-[#2563eb]" : "border-white bg-[#141414]/75",
          )}
        >
          <img
            src={bookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
            alt=""
            className="h-4 w-4 invert"
          />
        </button>
      </div>

      <p className="mt-[7px] truncate text-[13px] font-bold leading-[1.4] text-[#171717]">
        {movie.title}
      </p>
      <p className="mt-[3px] text-[11px] leading-[1.4] text-[#9ca3af]">{movie.releaseDate}</p>
    </Link>
  );
}