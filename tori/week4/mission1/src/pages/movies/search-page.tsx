import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { movies } from "../../data/movies";

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-72px)] w-full max-w-[1280px] px-0 py-8">
      {!normalizedQuery && (
        <h1 className="mb-8 mt-24 text-center text-2xl font-bold">
          어떤 영화를 찾고 있나요?
        </h1>
      )}

      <form
        onSubmit={handleSubmit}
        className={
          normalizedQuery
            ? "flex gap-2"
            : "mx-auto flex max-w-[480px] gap-2"
        }
      >
        <div className="relative flex-1">
          <img
            src="/icons/search.svg"
            alt=""
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
          />
          <input
            aria-label="검색어"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="예: 스파이더맨"
            className="h-12 w-full rounded-lg border border-border bg-surface pl-11 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          className="h-12 rounded-lg bg-gray-900 px-6 text-sm font-semibold text-white"
        >
          검색
        </button>
      </form>

      {normalizedQuery && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-bold">
            '{query}' 검색 결과{" "}
            <span className="font-normal text-text-sub">
              영화 {searchResults.length}편
            </span>
          </h2>

          {searchResults.length === 0 ? (
            <p className="py-16 text-center text-text-sub">검색 결과가 없어요.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-4">
              {searchResults.map((movie) => (
                <li
                  key={movie.id}
                  className="flex gap-4 rounded-lg border border-border bg-surface p-4"
                >
                  <img
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                    className="h-[120px] w-[80px] shrink-0 rounded-md object-cover"
                  />
                  <div className="flex min-w-0 flex-col">
                    <h3 className="truncate font-bold">{movie.title}</h3>
                    <p className="text-xs text-text-muted">{movie.originalTitle}</p>
                    <p className="mt-1 text-xs text-text-sub">{movie.releaseDate}</p>
                    <p className="mt-2 line-clamp-2 text-sm text-text-sub">
                      {movie.overview}
                    </p>
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="mt-2 text-sm font-semibold text-primary"
                    >
                      상세보기 →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  );
}