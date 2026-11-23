"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { searchMovies } from "../../api/movies/search-movies";
import { useFavorites } from "../../hooks/use-favorites";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { cn } from "../../utils/cn";

export function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";

  return <SearchScreen key={query} query={query} />;
}

function SearchScreen({ query }: { query: string }) {
  const router = useRouter();
  const [keyword, setKeyword] = useState(query);
  const normalizedQuery = query.trim();

  const searchQuery = useQuery({
    queryKey: ["movies", "search", { query: normalizedQuery }],
    queryFn: () => searchMovies({ query: normalizedQuery }),
    enabled: normalizedQuery.length > 0,
  });

  const searchResults = searchQuery.data?.results ?? [];

  const {
    bookmarkedMovieIds,
    toggleBookmark,
    isBookmarkDisabled,
    bookmarkError,
  } = useFavorites();

  const handleSearch = () => {
    const trimmedKeyword = keyword.trim();
    const params = new URLSearchParams();

    if (trimmedKeyword) {
      params.set("query", trimmedKeyword);
    }

    router.push(
      trimmedKeyword ? `/search?${params.toString()}` : "/search",
    );
  };

  return (
    <main
      className={cn(
        "page-container",
        normalizedQuery
          ? "py-5"
          : "flex flex-1 flex-col items-center pt-[min(20vh,180px)] pb-16",
      )}
    >
      {normalizedQuery ? (
        <h1 className="mb-4 text-[28px] font-bold leading-tight text-gray-900">
          영화 검색
        </h1>
      ) : (
        <h1 className="mb-8 text-center text-[28px] font-bold tracking-tight text-gray-900 sm:text-[32px]">
          어떤 영화를 찾고 있나요?
        </h1>
      )}

      <div
        className={cn(
          "flex items-center gap-3 rounded-lg border bg-white px-4",
          normalizedQuery
            ? "w-full border-gray-200 py-1.5"
            : "w-full max-w-[650px] border-[#17191e] py-2 shadow-[0_12px_24px_rgba(0,0,0,0.08)]",
        )}
      >
        <img
          src="/icons/search.svg"
          alt=""
          className="h-4 w-4 shrink-0"
        />

        <input
          aria-label="영화 검색어"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) {
              handleSearch();
            }
          }}
          placeholder="예: 스파이더맨"
          className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-gray-400"
        />

        {keyword && (
          <button
            type="button"
            aria-label="검색어 지우기"
            onClick={() => setKeyword("")}
            className="shrink-0 p-1"
          >
            <img src="/icons/close.svg" alt="" className="h-4 w-4" />
          </button>
        )}

        <button
          type="button"
          onClick={handleSearch}
          className="shrink-0 rounded-md bg-[#17191e] px-4 py-2.5 text-xs font-semibold text-white"
        >
          {normalizedQuery ? "다시 검색" : "검색"}
        </button>
      </div>

      {normalizedQuery && (
        <div className="mt-4">
          <div className="flex items-baseline justify-between gap-3 border-b border-gray-200 pb-3">
            <h2 className="text-sm font-bold text-gray-900">
              '{normalizedQuery}' 검색 결과
            </h2>

            {searchQuery.isSuccess && searchResults.length > 0 && (
              <p className="shrink-0 text-[10px] text-gray-400">
                영화 {searchResults.length}편 · 1페이지
              </p>
            )}
          </div>

          {searchQuery.isLoading ? (
            <p className="mt-16 text-center text-gray-500">
              검색 결과를 불러오는 중이에요.
            </p>
          ) : searchQuery.isError ? (
            <p
              role="alert"
              className="mt-16 text-center text-gray-500"
            >
              {searchQuery.error.message}
            </p>
          ) : searchQuery.isSuccess && searchResults.length === 0 ? (
            <p className="mt-16 text-center text-gray-500">
              '{normalizedQuery}'에 대한 검색 결과가 없어요.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
              {searchResults.map((movie) => {
                const isBookmarked = bookmarkedMovieIds.includes(movie.id);
                const posterUrl = getTmdbPosterUrl(movie.poster_path);

                return (
                  <li
                    key={movie.id}
                    className="flex min-w-0 gap-4 border-b border-gray-200 py-4"
                  >
                    {posterUrl ? (
                      <img
                        src={posterUrl}
                        alt={movie.title}
                        className="h-36 w-24 flex-shrink-0 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-36 w-24 flex-shrink-0 items-center justify-center rounded bg-gray-200 text-sm text-gray-500">
                        이미지 없음
                      </div>
                    )}

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between">
                        <h3 className="text-sm font-bold text-gray-900">
                          {movie.title}
                        </h3>

                        <button
                          type="button"
                          aria-label={
                            isBookmarked
                              ? "즐겨찾기 해제"
                              : "즐겨찾기 추가"
                          }
                          aria-pressed={isBookmarked}
                          disabled={isBookmarkDisabled}
                          title={bookmarkError ? "즐겨찾기 조회 실패: 눌러서 다시 시도" : undefined}
                          onClick={() => toggleBookmark(movie.id)}
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded disabled:cursor-wait disabled:opacity-50",
                            isBookmarked ? "bg-blue-600" : "bg-gray-200",
                          )}
                        >
                          <img
                            src={
                              isBookmarked
                                ? "/icons/bookmark.svg"
                                : "/icons/bookmark-outline.svg"
                            }
                            alt=""
                            className={cn(
                              "h-4 w-4",
                              isBookmarked && "invert",
                            )}
                          />
                        </button>
                      </div>

                      <p className="mt-1 text-[10px] text-gray-400">
                        {movie.original_title} · {movie.release_date}
                      </p>

                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">
                        {movie.overview}
                      </p>

                      <Link
                        href={`/movies/${movie.id}`}
                        className="mt-auto flex items-center gap-1 pt-3 text-xs font-semibold text-blue-600"
                      >
                        상세 보기
                        <img
                          src="/icons/arrow-right.svg"
                          alt=""
                          className="h-3 w-3"
                        />
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