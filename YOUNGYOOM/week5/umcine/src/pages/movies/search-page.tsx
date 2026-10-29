import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import { BookmarkButton } from "../../components/bookmark-button";

import { searchMovies } from "../../api/movies/search-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { normalizeModuleId } from "vite/module-runner";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });

  const [searchText, setSearchText] = useState(query ?? "");
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const normalizedQuery = (query ?? "").trim();

  useEffect(() => {
    let ignore = false;

    setMovies([]);
    setErrorMessage(null);

    if (!normalizedQuery) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    searchMovies({ query: normalizedQuery })
      .then((response) => {
        if (!ignore) setMovies(response.results);
      })
      .catch(() => {
        if (!ignore) setErrorMessage("검색 결과를 불러오지 못했어요.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [query]);

  //뒤로가기 등으로 URL 검색어 변경시 입력창도 비워짐
  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  if (!normalizedQuery) {
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
        <p className="text-sm text-gray-500">영화 {movies.length}편</p>
      </div>

      {movies.length === 0 ? (
        <p className="py-20 text-center text-gray-500">검색 결과가 없어요.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
          {movies.map((movie) => (
            <li key={movie.id} className="flex gap-4.5 border-b py-6">
              <div className="relative shrink-0">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={`${movie.title} 포스터`}
                    className="h-[190px] w-[126px] rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-[190px] w-[126px] items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-500">
                    포스터 없음
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <BookmarkButton movieId={movie.id} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-bold">{movie.title}</h3>
                <p className="text-xs text-gray-500">
                  {movie.original_title} · {movie.release_date}
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
