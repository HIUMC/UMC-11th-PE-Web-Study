import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  return <SearchForm key={query ?? ""} query={query} />;
}

function SearchForm({ query }: { query?: string }) {
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({ search: nextQuery ? { query: nextQuery } : {} });
  }

  function handleClear() {
    setSearchText("");
    navigate({ search: {} });
  }

  if (!normalizedQuery) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6">
        <h1 className="text-2xl font-bold">어떤 영화를 찾고 있나요?</h1>
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-[460px] gap-2"
        >
          <div className="flex flex-1 items-center gap-2 rounded-md border border-gray-300 px-3 py-2">
            <img src="/icons/search.svg" alt="" className="h-4 w-4" />
            <input
              aria-label="검색어"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="예: 스파이더맨"
              className="flex-1 text-sm outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-black px-5 py-2 text-sm text-white"
          >
            검색
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-8">
      <h1 className="text-2xl font-bold">영화 검색</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-gray-300 px-3 py-2">
          <img src="/icons/search.svg" alt="" className="h-4 w-4" />
          <input
            aria-label="검색어"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="flex-1 text-sm outline-none"
          />
          {searchText && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="검색어 지우기"
            >
              ✕
            </button>
          )}
        </div>
        <button
          type="submit"
          className="rounded-md bg-black px-5 py-2 text-sm text-white"
        >
          다시 검색
        </button>
      </form>

      <div className="mt-8 flex items-baseline justify-between">
        <h2 className="text-lg font-bold">'{query}' 검색 결과</h2>
        <p className="text-sm text-gray-400">영화 {searchResults.length}편</p>
      </div>

      {searchResults.length === 0 ? (
        <p className="mt-8 text-center text-gray-500">검색 결과가 없어요.</p>
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
          {searchResults.map((movie) => (
            <li
              key={movie.id}
              className="flex gap-4 border-t border-gray-200 py-6"
            >
              <img
                src={movie.posterPath}
                alt={`${movie.title} 포스터`}
                className="h-[150px] w-[100px] flex-shrink-0 rounded-md object-cover"
              />
              <div className="flex flex-1 flex-col">
                <h3 className="font-bold">{movie.title}</h3>
                <p className="text-xs text-gray-400">
                  {movie.originalTitle} &nbsp; {movie.releaseDate}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                  {movie.overview}
                </p>
                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                  className="mt-2 text-sm font-medium text-blue-600 no-underline"
                >
                  상세 보기 →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
