import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Route } from "../../routes/search";
import { movies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

export function SearchPage() {
  const { query } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [keyword, setKeyword] = useState(query ?? "");

  const bookmarkedMovieIds = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const results = query
    ? movies.filter(
        (movie) =>
          movie.title.includes(query) ||
          movie.originalTitle.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  const handleSearch = () => {
    navigate({ search: { query: keyword.trim() || undefined } });
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">영화 검색</h1>

      <div className="flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded border border-gray-900 px-4 py-3">
          <img src="/icons/search.svg" alt="" className="h-4 w-4" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="예: 스파이더맨"
            className="flex-1 outline-none"
          />
          {keyword && (
            <button type="button" onClick={() => setKeyword("")}>
              <img src="/icons/close.svg" alt="지우기" className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={handleSearch}
          className="rounded bg-black px-6 py-3 font-semibold text-white"
        >
          {query ? "다시 검색" : "검색"}
        </button>
      </div>

      {!query && (
        <p className="mt-24 text-center text-2xl font-bold text-gray-900">
          어떤 영화를 찾고 있나요?
        </p>
      )}

      {query && (
        <div className="mt-8">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-lg font-bold text-gray-900">'{query}' 검색 결과</h2>
            {results.length > 0 && (
              <p className="text-sm text-gray-500">영화 {results.length}편 · 1페이지</p>
            )}
          </div>

          {results.length === 0 ? (
            <p className="mt-16 text-center text-gray-500">
              '{query}'에 대한 검색 결과가 없어요.
            </p>
          ) : (
            <ul className="divide-y">
              {results.map((movie) => {
                const isBookmarked = bookmarkedMovieIds.includes(movie.id);
                return (
                  <li key={movie.id} className="flex gap-4 py-6">
                    <img
                      src={movie.posterPath}
                      alt={movie.title}
                      className="h-36 w-24 flex-shrink-0 rounded object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-gray-900">{movie.title}</h3>
                        <button
                          type="button"
                          aria-pressed={isBookmarked}
                          onClick={() => toggleBookmark(movie.id)}
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded",
                            isBookmarked ? "bg-blue-600" : "bg-gray-200",
                          )}
                        >
                          <img
                            src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
                            alt=""
                            className={cn("h-4 w-4", isBookmarked && "invert")}
                          />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500">
                        {movie.originalTitle} · {movie.releaseDate}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-gray-700">
                        {movie.overview}
                      </p>
                      <Link
                        to="/movies/$movieId"
                        params={{ movieId: String(movie.id) }}
                        className="mt-2 flex items-center gap-1 text-sm font-semibold text-blue-600"
                      >
                        상세 보기
                        <img src="/icons/arrow-right.svg" alt="" className="h-3 w-3" />
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </main>
  );
}