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
    <main className="min-h-[calc(100vh-72px)] bg-[#f6f7f9]">
      <div
        className={
          normalizedQuery
            ? "mx-auto w-full max-w-[1120px] px-4 py-10 xl:px-0"
            : "mx-auto w-full max-w-[720px] px-4 pt-[160px]"
        }
      >
        <h1
          className={
            normalizedQuery
              ? "mb-6 text-[28px] leading-[1.3] font-bold"
              : "mb-6 text-center text-[28px] leading-[1.3] font-bold"
          }
        >
          {normalizedQuery ? "영화 검색" : "어떤 영화를 찾고 있나요?"}
        </h1>

        <form className="relative" onSubmit={handleSubmit}>
          <img
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2"
            src="/icons/movie-icons/search.svg"
            alt=""
          />
          <input
            className="h-12 w-full rounded-[6px] border border-[#d9dbe1] bg-white pr-16 pl-12 text-sm outline-none focus:border-[#171719]"
            aria-label="검색어"
            placeholder="영화 제목을 입력해 주세요."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
          <button
            className="absolute top-1/2 right-1 h-10 -translate-y-1/2 rounded-[5px] bg-[#171719] px-4 text-sm font-semibold text-white"
            type="submit"
          >
            검색
          </button>
        </form>

        {normalizedQuery && (
          <section className="mt-8" aria-labelledby="search-result-heading">
            <div className="flex items-end justify-between border-b border-[#dfe1e6] pb-4">
              <h2
                id="search-result-heading"
                className="text-lg font-bold"
              >
                ‘{query}’ 검색 결과
              </h2>
              <p className="text-sm text-[#767676]">
                영화 {searchResults.length}편
              </p>
            </div>

            {searchResults.length === 0 ? (
              <p className="py-24 text-center text-[#767676]">
                검색 결과가 없어요.
              </p>
            ) : (
              <ul className="grid grid-cols-1 gap-x-10 lg:grid-cols-2">
                {searchResults.map((movie) => (
                  <li
                    className="flex min-w-0 gap-4 border-b border-[#e5e7eb] py-5"
                    key={movie.id}
                  >
                    <Link
                      className="shrink-0"
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                    >
                      <img
                        className="aspect-[2/3] w-[120px] rounded-[6px] object-cover"
                        src={movie.posterPath}
                        alt={`${movie.title} 포스터`}
                      />
                    </Link>

                    <div className="min-w-0 py-1">
                      <h3 className="truncate text-base font-bold">
                        {movie.title}
                      </h3>
                      <p className="mt-1 truncate text-xs text-[#999999]">
                        {movie.originalTitle} · {movie.releaseDate}
                      </p>
                      <p className="mt-3 line-clamp-2 text-[13px] leading-5 text-[#5f6066]">
                        {movie.overview}
                      </p>
                      <Link
                        className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-[#4f6ef7]"
                        to="/movies/$movieId"
                        params={{ movieId: String(movie.id) }}
                      >
                        상세 보기
                        <img
                          className="size-4"
                          src="/icons/movie-icons/arrow-right.svg"
                          alt=""
                        />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
