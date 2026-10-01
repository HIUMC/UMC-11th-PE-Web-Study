import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  // 뒤로 가기·앞으로 가기로 URL의 query가 바뀌면 입력창도 맞춰요.
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

  return (
    <main className="flex flex-1 flex-col gap-6 px-4 py-6 md:px-10 xl:px-20">
      <h1 className="text-[38px] font-bold leading-[44px] tracking-[-1.71px]">영화 검색</h1>

      <form onSubmit={handleSubmit} className="flex max-w-2xl gap-2.5" role="search">
        <input
          aria-label="검색어"
          placeholder="영화 제목이나 원제를 입력해 주세요"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          className="h-[42px] flex-1 rounded-lg border border-line bg-surface px-4 text-sm placeholder:text-ink-tertiary focus-visible:border-primary"
        />
        <button
          type="submit"
          className="h-[42px] rounded-lg bg-ink px-5 text-sm font-extrabold text-surface"
        >
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <EmptyMessage>검색어를 입력해 주세요.</EmptyMessage>
      ) : (
        <section className="flex flex-col gap-4" aria-live="polite">
          <div className="flex items-baseline gap-2">
            <h2 className="text-xl font-extrabold">‘{query}’ 검색 결과</h2>
            <p className="text-sm font-bold text-ink-secondary">영화 {searchResults.length}편</p>
          </div>

          {searchResults.length === 0 ? (
            <EmptyMessage>검색 결과가 없어요.</EmptyMessage>
          ) : (
            <ul className="flex flex-col gap-4">
              {searchResults.map((movie) => (
                <li
                  key={movie.id}
                  className="flex gap-5 rounded-[10px] border border-line bg-surface p-4"
                >
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    tabIndex={-1}
                    className="shrink-0"
                  >
                    <img
                      src={movie.posterPath}
                      alt={`${movie.title} 포스터`}
                      className="h-[150px] w-[100px] rounded-lg bg-page object-cover"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <h3 className="text-base font-extrabold">{movie.title}</h3>
                    <p className="text-sm text-ink-secondary">{movie.originalTitle}</p>
                    <p className="text-xs text-ink-tertiary">{movie.releaseDate}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-ink-secondary">
                      {movie.overview}
                    </p>
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="mt-auto self-start rounded-lg border border-line px-3 py-1.5 text-xs font-bold hover:bg-page"
                    >
                      상세 보기
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}

function EmptyMessage({ children }: { children: string }) {
  return (
    <p className="rounded-[10px] border border-dashed border-line bg-surface px-4 py-16 text-center text-sm font-bold text-ink-secondary">
      {children}
    </p>
  );
}
