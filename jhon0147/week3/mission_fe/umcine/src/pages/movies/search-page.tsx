import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });

  return <SearchContent key={query ?? ""} query={query} />;
}

interface SearchContentProps {
  query?: string;
}

function SearchContent({ query }: SearchContentProps) {
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

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="flex-1 bg-[#f6f8fb] px-4 py-10 sm:px-6 sm:py-14">
      <section className="mx-auto max-w-5xl" aria-labelledby="search-title">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold text-blue-600">UMCine Search</p>
          <h1
            className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-slate-900 sm:text-4xl"
            id="search-title"
          >
            영화 검색
          </h1>
          <form className="relative mt-7" onSubmit={handleSubmit}>
            <img
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 opacity-45"
              src="/icons/search.svg"
              alt=""
            />
            <input
              className="h-13 w-full rounded-xl border border-slate-200 bg-white pr-24 pl-12 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              aria-label="검색어"
              placeholder="영화 제목 또는 원제를 입력하세요"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
            <button
              className="absolute top-1.5 right-1.5 h-10 rounded-lg bg-blue-600 px-5 text-sm font-bold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200"
              type="submit"
            >
              검색
            </button>
          </form>
        </div>

        {!normalizedQuery ? (
          <div className="mt-20 text-center text-sm text-slate-500">
            <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-white shadow-sm">
              <img className="size-6 opacity-45" src="/icons/movie.svg" alt="" />
            </div>
            <p>검색어를 입력해 주세요.</p>
          </div>
        ) : (
          <div className="mt-12">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                ‘{query}’ 검색 결과
              </h2>
              <p className="text-sm font-semibold text-slate-500">
                영화 {searchResults.length}편
              </p>
            </div>

            {searchResults.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center text-sm text-slate-500">
                검색 결과가 없어요.
              </div>
            ) : (
              <ul className="space-y-4">
                {searchResults.map((movie) => (
                  <li
                    className="grid gap-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:grid-cols-[128px_1fr] sm:p-5"
                    key={movie.id}
                  >
                    <Link
                      className="mx-auto block aspect-[4/5] w-full max-w-50 overflow-hidden rounded-xl bg-slate-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:mx-0 sm:w-32"
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                    >
                      <img
                        className="size-full object-cover transition-transform duration-200 hover:scale-[1.02]"
                        src={movie.posterPath}
                        alt={`${movie.title} 포스터`}
                      />
                    </Link>
                    <div className="min-w-0 self-center">
                      <h3 className="text-xl font-extrabold tracking-tight text-slate-900">
                        {movie.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {movie.originalTitle}
                      </p>
                      <p className="mt-3 text-xs font-semibold text-slate-400">
                        {movie.releaseDate}
                      </p>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                        {movie.overview}
                      </p>
                      <Link
                        className="mt-4 inline-flex items-center gap-1 rounded-lg text-sm font-bold text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200"
                        to="/movies/$movieId"
                        params={{ movieId: String(movie.id) }}
                      >
                        상세 보기
                        <img
                          className="size-4"
                          src="/icons/arrow-right.svg"
                          alt=""
                        />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
