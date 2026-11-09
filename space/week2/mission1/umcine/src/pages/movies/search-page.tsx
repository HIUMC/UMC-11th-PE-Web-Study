import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { initialMovies as movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  function clearSearch() {
    setSearchText("");
  }

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-4 px-5 py-6 sm:px-10 lg:px-20">
      <div className="flex w-full flex-col items-start gap-4">
        <h1 className="w-full text-[32px] leading-10 font-bold tracking-[-0.8px] text-text-primary sm:text-4xl">
          영화 검색
        </h1>
        <form
          className="flex h-14 w-full items-center gap-3 rounded-lg border border-border-default bg-bg-surface px-3.5 pr-2.5"
          onSubmit={handleSubmit}
        >
          <img className="size-6 shrink-0" src="/icons/search.svg" alt="" aria-hidden="true" />
          <input
            className="min-w-0 flex-1 bg-transparent px-0.5 py-px text-sm font-bold text-text-primary outline-none placeholder:text-text-tertiary"
            aria-label="검색어"
            placeholder="영화 제목을 검색해 보세요"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
          {searchText && (
            <button
              className="flex size-6 shrink-0 items-center justify-center"
              type="button"
              aria-label="검색어 지우기"
              onClick={clearSearch}
            >
              <img className="size-3.5" src="/icons/close.svg" alt="" aria-hidden="true" />
            </button>
          )}
          <button
            className="h-10 shrink-0 rounded-lg bg-text-primary px-4 text-sm font-extrabold text-bg-surface transition-colors hover:bg-text-secondary"
            type="submit"
          >
            {normalizedQuery ? "다시 검색" : "검색"}
          </button>
        </form>
      </div>

      {!normalizedQuery ? (
        <p className="w-full border-y border-border-default py-5 text-sm text-text-secondary">
          검색어를 입력해 주세요.
        </p>
      ) : (
        <>
          <div className="flex min-h-14 w-full items-center justify-between gap-4 border-y border-border-default">
            <h2 className="text-lg font-bold text-text-primary">‘{query}’ 검색 결과</h2>
            <p className="shrink-0 text-xs text-text-tertiary">
              영화 {searchResults.length}편 · 1페이지
            </p>
          </div>
          {searchResults.length === 0 ? (
            <p className="w-full py-16 text-center text-sm text-text-secondary">
              검색 결과가 없어요.
            </p>
          ) : (
            <ul className="w-full">
              {searchResults.map((movie) => (
                <li
                  className="flex w-full items-start gap-4 border-b border-border-default py-5"
                  key={movie.id}
                >
                  <Link
                    className="block h-48 w-32 shrink-0 overflow-hidden rounded-[10px] bg-bg-page"
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                  >
                    <img
                      className="size-full object-cover"
                      src={movie.posterPath}
                      alt={`${movie.title} 포스터`}
                    />
                  </Link>
                  <div className="flex min-h-48 min-w-0 flex-1 flex-col items-start gap-2">
                    <h3 className="w-full text-lg leading-6 font-bold text-text-primary">
                      {movie.title}
                    </h3>
                    <div className="flex max-w-full flex-wrap items-center gap-x-2 text-xs text-text-tertiary">
                      <span>{movie.originalTitle}</span>
                      <span aria-hidden="true">·</span>
                      <span>{movie.releaseDate}</span>
                    </div>
                    <p className="line-clamp-2 max-w-[560px] text-xs leading-5 text-text-secondary">
                      {movie.overview}
                    </p>
                  <Link
                    className="mt-auto inline-flex items-center gap-1 text-xs font-extrabold text-action-primary"
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                  >
                    <span>상세 보기</span>
                    <img className="size-4" src="/icons/arrow-right.svg" alt="" aria-hidden="true" />
                  </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}