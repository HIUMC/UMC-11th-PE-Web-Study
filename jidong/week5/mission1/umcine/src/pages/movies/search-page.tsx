import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { searchMovies } from "../../api/movies/search-movies";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { MoviePoster } from "../../components/movies/movie-poster";
import { formatReleaseDate } from "../../utils/movies/format-movie";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  // 검색어가 바뀌면 key가 바뀌어 입력창과 결과 상태가 새로 시작돼요.
  return <SearchForm key={query ?? ""} query={query ?? ""} />;
}

function SearchForm({ query }: { query: string }) {
  const navigate = useNavigate({ from: "/search" });
  const normalizedQuery = query.trim();

  const [searchText, setSearchText] = useState(query);
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  // 검색어가 있을 때만 요청하므로 로딩 상태도 검색어 유무로 시작해요.
  const [isLoading, setIsLoading] = useState(Boolean(normalizedQuery));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // 빈 검색어는 요청하지 않아요.
    if (!normalizedQuery) return;

    let ignore = false;

    searchMovies({ query: normalizedQuery })
      .then((response) => {
        if (ignore) return;
        setMovies(response.results);
        setTotalResults(response.total_results);
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
  }, [normalizedQuery]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({ search: nextQuery ? { query: nextQuery } : {} });
  }

  function handleClear() {
    setSearchText("");
    navigate({ search: {} });
  }

  // 1. 빈 검색어: 검색 안내
  if (!normalizedQuery) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6">
        <h1 className="text-2xl font-bold">어떤 영화를 찾고 있나요?</h1>
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-[460px] gap-2"
        >
          <div className="flex flex-1 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2">
            <img src="/icons/search.svg" alt="" className="h-4 w-4" />
            <input
              aria-label="검색어"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="예: 스파이더맨"
              className="flex-1 text-sm outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-black px-5 py-2 text-sm text-white"
          >
            검색
          </button>
        </form>
        <p className="text-sm text-gray-500">검색어를 입력해 주세요.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-8">
      <h1 className="text-2xl font-bold">영화 검색</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2">
          <img src="/icons/search.svg" alt="" className="h-4 w-4" />
          <input
            aria-label="검색어"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="flex-1 text-sm outline-none"
          />
          {searchText && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="검색어 지우기"
            >
              ✕
            </button>
          )}
        </div>
        <button
          type="submit"
          className="rounded-md bg-black px-5 py-2 text-sm text-white"
        >
          다시 검색
        </button>
      </form>

      <div className="mt-8 flex items-baseline justify-between">
        <h2 className="text-lg font-bold">'{normalizedQuery}' 검색 결과</h2>
        {!isLoading && !errorMessage && (
          <p className="text-sm text-gray-400">영화 {totalResults}편</p>
        )}
      </div>

      {/* 2. 로딩 → 3. 오류 → 4. 빈 결과 → 5. 성공 */}
      {isLoading ? (
        <p aria-busy="true" className="mt-8 text-center text-gray-500">
          검색 결과를 불러오는 중이에요.
        </p>
      ) : errorMessage ? (
        <p role="alert" className="mt-8 text-center text-red-500">
          {errorMessage}
        </p>
      ) : movies.length === 0 ? (
        <p className="mt-8 text-center text-gray-500">검색 결과가 없어요.</p>
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
          {movies.map((movie) => (
            <li
              key={movie.id}
              className="flex gap-4 border-t border-gray-200 py-6"
            >
              <div className="relative h-[150px] w-[100px] flex-shrink-0 overflow-hidden rounded-md">
                <MoviePoster
                  posterPath={movie.poster_path}
                  title={movie.title}
                />
                <BookmarkButton
                  movieId={movie.id}
                  movieTitle={movie.title}
                  className="absolute right-1.5 top-1.5"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <h3 className="font-bold">{movie.title}</h3>
                <p className="text-xs text-gray-400">
                  {movie.original_title} &nbsp;{" "}
                  {formatReleaseDate(movie.release_date)}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                  {movie.overview || "줄거리 정보가 없어요."}
                </p>
                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                  className="mt-2 text-sm font-medium text-blue-600 no-underline"
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
