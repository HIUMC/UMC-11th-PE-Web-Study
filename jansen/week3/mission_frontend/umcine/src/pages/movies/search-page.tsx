import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";
import { ArrowRightIcon, CloseIcon, SearchIcon } from "../../components/icons";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const hasQuery = normalizedQuery !== "";
  const searchResults = hasQuery
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

  function handleClear() {
    setSearchText("");
    navigate({ search: {} });
  }

  return (
    <main
      className={cn(
        "px-20",
        hasQuery ? "pt-8" : "flex flex-col items-center pt-[200px]",
      )}
    >
      <h1 className="text-[40px] font-extrabold text-ink">
        {hasQuery ? "영화 검색" : "어떤 영화를 찾고 있나요?"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className={cn(
          "mt-6 flex w-full items-center gap-3 bg-white px-5",
          hasQuery
            ? "h-[62px] rounded-xl border border-line"
            : "h-[68px] max-w-[750px] rounded-2xl border-2 border-ink shadow-lg",
        )}
      >
        <SearchIcon className="size-5 shrink-0 text-muted" />
        <input
          aria-label="검색어"
          placeholder="예: 스파이더맨"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          className="h-full flex-1 bg-transparent text-base outline-none placeholder:text-muted"
        />
        {hasQuery && searchText && (
          <button
            type="button"
            aria-label="검색어 지우기"
            onClick={handleClear}
            className="cursor-pointer text-muted"
          >
            <CloseIcon className="size-5" />
          </button>
        )}
        <button
          type="submit"
          className="h-[42px] cursor-pointer rounded-lg bg-ink px-4 text-sm font-semibold text-white"
        >
          {hasQuery ? "다시 검색" : "검색"}
        </button>
      </form>

      {!hasQuery && (
        <p className="mt-6 text-muted">검색어를 입력해 주세요.</p>
      )}

      {hasQuery && (
        <section className="mt-6">
          <div className="flex items-end justify-between border-b border-line pb-3">
            <h2 className="text-xl font-bold">‘{query}’ 검색 결과</h2>
            <p className="text-sm text-muted">영화 {searchResults.length}편</p>
          </div>

          {searchResults.length === 0 ? (
            <p className="py-10 text-muted">검색 결과가 없어요.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-x-14 max-[960px]:grid-cols-1">
              {searchResults.map((movie) => (
                <li key={movie.id} className="flex gap-5 border-b border-line py-7">
                  <img
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                    className="aspect-[2/3] w-[120px] shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="text-xl font-bold">{movie.title}</h3>
                    <p className="mt-1 text-sm text-muted">
                      {movie.originalTitle} {movie.releaseDate}
                    </p>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
                      {movie.overview}
                    </p>
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="mt-auto flex items-center gap-1 pt-3 text-sm font-semibold text-brand"
                    >
                      상세 보기
                      <ArrowRightIcon className="size-4" />
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