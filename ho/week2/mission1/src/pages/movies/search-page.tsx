import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const [previousQuery, setPreviousQuery] = useState(query);

  if (query !== previousQuery) {
    setPreviousQuery(query);
    setSearchText(query ?? "");
  }

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
      to: "/search",
      search: () => (nextQuery ? { query: nextQuery } : {}),
    });
  }

  function handleReset() {
    setSearchText("");
    navigate({
      to: "/search",
      search: () => ({}),
    });
  }

  const searchForm = (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex h-16 items-center rounded-xl border border-slate-900 bg-white px-5 shadow-sm",
        normalizedQuery && "h-14 rounded-none border-x-0 border-t-0 px-4 shadow-none",
      )}
    >
      <img src="/icons/search.svg" alt="" className="mr-4 size-5 opacity-60" />
      <input
        aria-label="검색어"
        placeholder="예: 스파이더맨"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
      />
      {normalizedQuery && (
        <button
          type="button"
          aria-label="검색어 지우기"
          onClick={() => setSearchText("")}
          className="mr-4 flex size-8 items-center justify-center rounded-md hover:bg-slate-100"
        >
          <img src="/icons/close.svg" alt="" className="size-5 opacity-60" />
        </button>
      )}
      <button
        type="submit"
        className="h-10 rounded-lg bg-[#17191d] px-5 text-sm font-bold text-white transition-colors hover:bg-slate-700"
      >
        {normalizedQuery ? "다시 검색" : "검색"}
      </button>
    </form>
  );

  if (!normalizedQuery) {
    return (
      <main className="mx-auto flex w-full max-w-7xl flex-1 items-start justify-center px-8 pt-40 lg:px-12 lg:pt-44">
        <section className="w-full max-w-3xl text-center">
          <h1 className="mb-10 text-4xl font-bold tracking-[-0.04em]">
            어떤 영화를 찾고 있나요?
          </h1>
          {searchForm}
          <p className="mt-5 text-sm text-slate-500">검색어를 입력해 주세요.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-8 py-7 lg:px-12">
      <div className="mb-5 flex items-end justify-between">
        <h1 className="text-4xl font-bold tracking-[-0.04em]">영화 검색</h1>
        <button
          type="button"
          onClick={handleReset}
          className="text-sm font-semibold text-slate-500 hover:text-slate-950"
        >
          검색 초기화
        </button>
      </div>

      <section className="border-y border-slate-200">
        {searchForm}
        <div className="flex items-center justify-between border-b border-slate-200 py-4">
          <h2 className="text-lg font-bold">‘{query}’ 검색 결과</h2>
          <p className="text-sm text-slate-400">
            영화 {searchResults.length}편 · 1페이지
          </p>
        </div>

        {searchResults.length === 0 ? (
          <div className="flex min-h-72 items-center justify-center text-base font-medium text-slate-500">
            검색 결과가 없어요.
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
            {searchResults.map((movie) => (
              <li
                key={movie.id}
                className="flex min-w-0 gap-5 border-b border-slate-200 py-6"
              >
                <Link
                  from="/search"
                  to="/movies/$movieId"
                  params={(previous) => ({
                    ...previous,
                    movieId: String(movie.id),
                  })}
                  className="shrink-0"
                >
                  <img
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                    className="h-44 w-28 rounded-lg object-cover shadow-sm"
                  />
                </Link>
                <div className="min-w-0 py-1">
                  <h3 className="truncate text-lg font-bold">{movie.title}</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    {movie.originalTitle}&nbsp;&nbsp; {movie.releaseDate}
                  </p>
                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
                    {movie.overview}
                  </p>
                  <Link
                    from="/search"
                    to="/movies/$movieId"
                    params={(previous) => ({
                      ...previous,
                      movieId: String(movie.id),
                    })}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700"
                  >
                    상세 보기 <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
