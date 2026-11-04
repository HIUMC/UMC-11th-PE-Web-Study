import { useSearch } from "@tanstack/react-router";
import SearchForm from "../../components/movies/search-form";
import SearchResultCard from "../../components/movies/search-result-card";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });

  const displayQuery = query?.trim() ?? "";
  const normalizedQuery = displayQuery.toLowerCase();

  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  if (!normalizedQuery) {
    return (
      <main className="flex-1 bg-[#f5f6f8]">
        <div className="mx-auto max-w-[840px] px-6 pb-24 pt-24 sm:pt-36">
          <h1 className="mb-8 text-center text-2xl font-extrabold tracking-tight sm:text-[32px]">
            어떤 영화를 찾고 있나요?
          </h1>

          <SearchForm
            key={query ?? ""}
            initialQuery={query ?? ""}
          />

          <p className="mt-5 text-center text-sm text-[#8a909b]">
            검색어를 입력해 주세요.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[#f5f6f8]">
      <div className="mx-auto max-w-[1328px] px-6 pb-20 pt-6">
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight sm:text-[32px]">
          영화 검색
        </h1>

        <SearchForm
          key={query ?? ""}
          initialQuery={query ?? ""}
          buttonLabel="다시 검색"
        />

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-b border-[#e4e7ee] pb-4">
          <h2 className="min-w-0 break-words text-base font-bold">
            ‘{displayQuery}’ 검색 결과
          </h2>

          <p
            aria-live="polite"
            className="shrink-0 text-xs text-[#8a909b]"
          >
            영화 {searchResults.length}편
          </p>
        </div>

        {searchResults.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg font-bold">
              검색 결과가 없어요.
            </p>
            <p className="mt-3 text-sm text-[#6b7280]">
              다른 제목이나 원제로 검색해 보세요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-2">
            {searchResults.map((movie) => (
              <SearchResultCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import { useMovies } from "../../components/movies/movie-context";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
  const { movies, toggleBookmark } = useMovies();
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <main className="flex-1 bg-[#f5f6f8]">
      <div className="mx-auto max-w-[1328px] px-6 pb-20 pt-6">
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight sm:text-[32px]">
          영화 목록
        </h1>

        <MovieGrid
          movies={movies}
          onToggleBookmark={toggleBookmark}
        />

        <Pagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </main>
  );
}