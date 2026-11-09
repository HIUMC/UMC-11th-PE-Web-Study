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

  if (!query) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-6">
        <div className="w-full max-w-[790px]">
          <h1 className="mb-8 text-center text-[38px] font-bold">
            어떤 영화를 찾고 있나요?
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex w-full items-center gap-4 rounded-lg border-2 border-black bg-white p-3 pl-4 shadow-lg"
          >
            <img src="icons/search.svg" />
            <input
              aria-label="검색어"
              placeholder="예: 스파이더맨"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="flex-1 bg-transparent outline-none"
            />
            <button
              type="submit"
              className="cursor-pointer rounded-lg bg-black px-5 py-2 text-white"
            >
              검색
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] py-6">
      <h1 className="mb-4 text-[38px] font-bold">영화 검색</h1>

      <form
        onSubmit={handleSubmit}
        className="flex w-full items-center gap-4 rounded-lg border border-gray-200 bg-white p-3 pl-4"
      >
        <img src="icons/search.svg" />
        <input
          aria-label="검색어"
          placeholder="예: 스파이더맨"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          className="flex-1 bg-transparent outline-none"
        />
        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-black px-5 py-2 text-white"
        >
          다시 검색
        </button>
      </form>

      <div className="mt-6 flex items-end justify-between border-b pb-4">
        <h2 className="font-bold text-xl">‘{query}’ 검색 결과</h2>
        <p className="text-sm text-gray-500">영화 {searchResults.length}편</p>
      </div>

      {searchResults.length === 0 ? (
        <p className="py-20 text-center text-gray-500">검색 결과가 없어요.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
          {searchResults.map((movie) => (
            <li key={movie.id} className="flex gap-4.5 border-b py-6">
              <img
                src={movie.posterPath}
                alt={`${movie.title} 포스터`}
                className="h-[190px] w-[126px] shrink-0 rounded-lg object-cover"
              />
              <div className="flex flex-col gap-2">
                <h3 className="font-bold">{movie.title}</h3>
                <p className="text-xs text-gray-500">
                  {movie.originalTitle} · {movie.releaseDate}
                </p>
                <p className="line-clamp-2 text-sm text-gray-700">
                  {movie.overview}
                </p>
                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                  className="text-sm font-medium text-blue-600"
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
