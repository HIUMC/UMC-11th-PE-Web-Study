import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
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

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  if (!normalizedQuery) {
    return (
      <main className="flex flex-col items-center px-4 pt-24 text-center">
        <h1 className="mb-8 text-4xl font-bold text-ink">
          어떤 영화를 찾고 있나요?
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-[1000px] items-center gap-3 rounded-xl border-2 border-ink bg-surface py-2 pr-2 pl-5 shadow-lg shadow-ink/5"
        >
          <img src="/icons/search.svg" alt="" className="h-6 w-6 shrink-0" />
          <input
            aria-label="검색어"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="예: 스파이더맨"
            className="flex-1 bg-transparent py-2 text-lg text-ink placeholder:text-ink-subtle focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-ink px-5 py-3 text-sm font-bold text-surface"
          >
            검색
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1312px] px-4 pt-6 pb-10">
      <h1 className="mb-5 text-4xl font-bold text-ink">영화 검색</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-6 flex h-[54px] items-center gap-3 rounded-lg border border-border bg-surface pr-1.5 pl-4"
      >
        <img src="/icons/search.svg" alt="" className="h-6 w-6 shrink-0" />
        <input
          aria-label="검색어"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="예: 스파이더맨"
          className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
        />
        {searchText && (
          <button
            type="button"
            aria-label="검색어 지우기"
            onClick={() => setSearchText("")}
            className="flex h-8 w-8 shrink-0 items-center justify-center"
          >
            <img src="/icons/close.svg" alt="" className="h-6 w-6" />
          </button>
        )}
        <button
          type="submit"
          className="h-[42px] shrink-0 rounded-md bg-ink px-4 text-sm font-bold text-surface"
        >
          다시 검색
        </button>
      </form>

      <div className="mb-5 flex items-baseline justify-between border-b border-border pb-4">
        <h2 className="text-lg font-bold text-ink">‘{query}’ 검색 결과</h2>
        <p className="text-xs text-ink-subtle">
          영화 {searchResults.length}편 · 1페이지
        </p>
      </div>

      {searchResults.length === 0 ? (
        <p className="py-10 text-center text-ink-muted">검색 결과가 없어요.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2">
          {searchResults.map((movie) => (
            <li
              key={movie.id}
              className="flex gap-5 border-b border-border pb-7"
            >
              <img
                src={movie.posterPath}
                alt={`${movie.title} 포스터`}
                className="h-[190px] w-[126px] shrink-0 rounded-lg object-cover"
              />
              <div className="flex min-w-0 flex-col pt-1">
                <h3 className="text-lg font-bold text-ink">{movie.title}</h3>
                <p className="mt-2 flex flex-wrap gap-2 text-xs text-ink-subtle">
                  <span>{movie.originalTitle}</span>
                  <span>{movie.releaseDate}</span>
                </p>
                <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-ink-muted">
                  {movie.overview}
                </p>
                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                  className="mt-4 inline-flex items-center gap-1.5 self-start text-xs font-bold text-brand"
                >
                  상세 보기
                  <span
                    aria-hidden="true"
                    className="h-3.5 w-3.5 bg-brand [mask:url(/icons/arrow-right.svg)_center/contain_no-repeat]"
                  />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
