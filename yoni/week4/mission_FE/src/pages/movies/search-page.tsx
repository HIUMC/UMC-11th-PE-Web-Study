import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Route } from "../../routes/search";
import { movies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function SearchPage() {
  const { query } = Route.useSearch();
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState(query);

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    navigate({
      to: "/search",
      search: {
        query: inputValue.trim(),
      },
    });
  };

  const handleClear = () => {
    setInputValue("");

    navigate({
      to: "/search",
      search: {
        query: "",
      },
    });
  };

  const normalizedQuery = query.trim().toLowerCase();

  const results = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  return (
    <main className="min-h-[calc(100vh-88px)] bg-[#f7f8fa]">
      <div className="mx-auto w-full max-w-[1280px] px-4 pt-7 pb-20 sm:px-6 md:px-10 xl:px-[80px]">
        {/* 페이지 제목 */}
        <h1 className="mb-5 text-[30px] leading-[1.3] font-bold text-[#1f1f1f]">
          영화 검색
        </h1>

        {/* 검색창 */}
        <form
          onSubmit={handleSubmit}
          className="flex h-[52px] w-full items-center rounded-[10px] border border-[#d1d5db] bg-white px-4"
        >
          <img
            src="/icons/movie-icons/search.svg"
            alt=""
            className="mr-4 h-5 w-5 opacity-60"
          />

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="영화 제목을 입력해주세요."
            className="h-full min-w-0 flex-1 border-none bg-transparent text-[13px] text-[#1f1f1f] outline-none placeholder:text-[#9ca3af]"
          />

          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="검색어 지우기"
              className="mr-3 flex h-8 w-8 cursor-pointer items-center justify-center text-[22px] text-[#6b7280]"
            >
              ×
            </button>
          )}

          <button
            type="submit"
            className="h-[38px] shrink-0 cursor-pointer rounded-[6px] bg-[#1f2329] px-[18px] text-[12px] font-semibold text-white"
          >
            {normalizedQuery ? "다시 검색" : "검색"}
          </button>
        </form>

        {/* 검색 전 */}
        {!normalizedQuery && (
          <p className="mt-5 text-center text-[12px] text-[#9ca3af]">
            검색어를 입력해주세요.
          </p>
        )}

        {/* 검색 결과 없음 */}
        {normalizedQuery && results.length === 0 && (
          <p className="mt-10 text-center text-[14px] text-[#6b7280]">
            검색 결과가 없어요.
          </p>
        )}

        {/* 검색 결과 */}
        {results.length > 0 && (
          <section className="mt-4">
            {/* 결과 헤더 */}
            <div className="flex items-end justify-between border-b border-[#e5e7eb] pb-4">
              <h2 className="text-[18px] font-bold text-[#1f1f1f]">
                ‘{query}’ 검색 결과
              </h2>

              <p className="text-[11px] text-[#9ca3af]">
                영화 {results.length}편 · 1페이지
              </p>
            </div>

            {/* 영화 목록 */}
            <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
              {results.map((movie) => {
                const isBookmarked = bookmarkedMovieIds.includes(movie.id);

                return (
                  <article
                    key={movie.id}
                    className="flex min-w-0 gap-4 border-b border-[#e5e7eb] py-5"
                  >
                    {/* 포스터 */}
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="shrink-0"
                    >
                      <img
                        src={movie.posterPath}
                        alt={`${movie.title} 포스터`}
                        className="h-[180px] w-[120px] rounded-lg object-cover"
                      />
                    </Link>

                    {/* 영화 정보 */}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to="/movies/$movieId"
                          params={{ movieId: String(movie.id) }}
                          className="min-w-0"
                        >
                          <h3 className="text-[15px] leading-5 font-bold text-[#1f1f1f]">
                            {movie.title}
                          </h3>
                        </Link>

                        {/* 북마크 */}
                        <button
                          type="button"
                          onClick={() => toggleBookmark(movie.id)}
                          aria-pressed={isBookmarked}
                          aria-label={
                            isBookmarked ? "북마크 해제" : "북마크 추가"
                          }
                          className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center"
                        >
                          <img
                            src={
                              isBookmarked
                                ? "/icons/movie-icons/bookmark.svg"
                                : "/icons/movie-icons/bookmark-outline.svg"
                            }
                            alt=""
                            className="h-[18px] w-[18px]"
                          />
                        </button>
                      </div>

                      {/* 영문 제목 + 날짜 */}
                      <div className="mt-2 flex flex-wrap gap-x-3 text-[11px] text-[#9ca3af]">
                        <span>{movie.originalTitle}</span>
                        <span>{movie.releaseDate}</span>
                      </div>

                      {/* 설명 */}
                      <p className="mt-3 line-clamp-2 text-[12px] leading-5 text-[#6b7280]">
                        {movie.overview}
                      </p>

                      {/* 상세보기 */}
                      <Link
                        to="/movies/$movieId"
                        params={{ movieId: String(movie.id) }}
                        className="mt-auto pt-4 text-[12px] font-semibold text-[#2563eb]"
                      >
                        상세 보기 →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
