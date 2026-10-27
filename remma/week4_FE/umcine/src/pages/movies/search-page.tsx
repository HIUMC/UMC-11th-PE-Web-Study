import { useState, useEffect, type SubmitEvent } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { dummyMovies } from "../../data/movie_data";
import { BookmarkButton } from "../../components/bookmark-button";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const searchResults = normalizedQuery
    ? dummyMovies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery)
      )
    : [];

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
      {/* 1. 검색어가 없을 때의 초기 화면 (시안 3 완벽 대응) */}
      {!normalizedQuery ? (
        <div className="flex min-h-[65vh] flex-col items-center justify-center">
          <h1 className="mb-8 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
            어떤 영화를 찾고 있나요?
          </h1>
          <form onSubmit={handleSubmit} className="w-full max-w-2xl">
            <div className="flex items-center rounded-2xl border-2 border-gray-900 bg-white p-2 pl-5 shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                aria-label="영화 검색어 입력"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="예: 스파이더맨"
                className="w-full px-3 py-1.5 text-base font-medium text-gray-900 placeholder-gray-400 outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black"
              >
                검색
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* 2. 검색 결과가 있을 때의 화면 */
        <div className="flex flex-col gap-8">
          {/* 상단 재검색 바 */}
          <form onSubmit={handleSubmit} className="w-full max-w-xl">
            <div className="flex items-center rounded-xl border border-gray-300 bg-white p-1.5 pl-4 shadow-xs">
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full px-2 py-1 text-sm font-medium text-gray-900 outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-gray-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-black"
              >
                검색
              </button>
            </div>
          </form>

          {/* 검색 결과 헤더 */}
          <div>
            <h2 className="text-2xl font-extrabold text-gray-950">
              ‘{query}’ 검색 결과
            </h2>
            <p className="mt-1 text-sm font-medium text-gray-500">
              영화 {searchResults.length}편
            </p>
          </div>

          {/* 결과 목록 또는 빈 결과 안내 */}
          {searchResults.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-base font-semibold text-gray-500">검색 결과가 없어요.</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-gray-100">
              {searchResults.map((movie) => (
                <div key={movie.id} className="flex gap-6 py-6 first:pt-0">
                  {/* 포스터 */}
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="aspect-[2/3] w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100 shadow-sm"
                  >
                    <img
                      src={movie.posterPath}
                      alt={`${movie.title} 포스터`}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </Link>

                  {/* 정보 */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
                        <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600">
                          {movie.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-400">{movie.originalTitle}</p>
                      <p className="mt-1 text-xs text-gray-500">{movie.releaseDate}</p>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
                        {movie.overview}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-4">
                      <BookmarkButton movieId={movie.id} className="px-3 py-1.5 text-xs" />
                      <Link
                        to="/movies/$movieId"
                        params={{ movieId: String(movie.id) }}
                        className="inline-flex text-xs font-semibold text-blue-600 hover:underline"
                      >
                        상세 보기 →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}