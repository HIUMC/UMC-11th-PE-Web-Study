import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import MovieGrid from "../../components/movies/movie-grid";
import { movies } from "../../data/movies";

export default function SearchPage() {
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
    navigate({ search: nextQuery ? { query: nextQuery } : {} });
  }

  return (
    <main className="mx-auto max-w-[1200px] px-6 pt-8 pb-16">
      <h1 className="mb-6 text-[28px] font-bold">영화 검색</h1>
      <form onSubmit={handleSubmit} className="mb-8 flex gap-2">
        <input
          type="text"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="영화 제목을 검색해 보세요"
          className="h-11 flex-1 rounded-lg border border-[#333] bg-[#1c1c1c] px-4 text-[#f5f5f5] outline-none focus:border-[#b2dab1]"
        />
        <button type="submit" className="h-11 rounded-lg bg-[#b2dab1] px-5 font-bold text-[#141414]">
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <p className="text-[#a0a0a0]">검색어를 입력해 주세요.</p>
      ) : searchResults.length === 0 ? (
        <p className="text-[#a0a0a0]">검색 결과가 없어요.</p>
      ) : (
        <>
          <p className="mb-4 text-[#a0a0a0]">
            '{query}' 검색 결과 · 영화 {searchResults.length}편
          </p>
          <MovieGrid movies={searchResults} />
        </>
      )}
    </main>
  );
}
