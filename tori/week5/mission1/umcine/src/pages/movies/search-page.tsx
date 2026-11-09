import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { searchMovies } from "../../api/movies/search-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });

  const [searchText, setSearchText] = useState(query ?? "");

  // TMDB 검색 결과 및 요청 상태
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // URL의 검색어가 바뀌면 입력창에도 반영
  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  // TMDB API 검색
  useEffect(() => {
    let ignore = false;
    const normalizedQuery = query?.trim() ?? "";

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
        if (!ignore) {
          setErrorMessage("검색 결과를 불러오지 못했어요.");
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [query]);

  const normalizedQuery = query?.trim() ?? "";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextQuery = searchText.trim();

    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-72px)] w-full max-w-[1280px] px-0 py-8">
      {!normalizedQuery && (
        <h1 className="mb-8 mt-24 text-center text-2xl font-bold">
          어떤 영화를 찾고 있나요?
        </h1>
      )}

      <form
        onSubmit={handleSubmit}
        className={
          normalizedQuery
            ? "flex gap-2"
            : "mx-auto flex max-w-[480px] gap-2"
        }
      >
        <div className="relative flex-1">
          <img
            src="/icons/search.svg"
            alt=""
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
          />

          <input
            aria-label="검색어"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="예: 스파이더맨"
            className="h-12 w-full rounded-lg border border-border bg-surface pl-11 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>

        <button
          type="submit"
          className="h-12 rounded-lg bg-gray-900 px-6 text-sm font-semibold text-white"
        >
          검색
        </button>
      </form>

      {normalizedQuery && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-bold">
            '{query}' 검색 결과{" "}
            {!isLoading && !errorMessage && (
              <span className="font-normal text-text-sub">
                영화 {movies.length}편
              </span>
            )}
          </h2>

          {/* 로딩 상태 */}
          {isLoading ? (
            <p className="py-16 text-center text-text-sub">
              검색 결과를 불러오는 중이에요.
            </p>

          /* 오류 상태 */
          ) : errorMessage ? (
            <p className="py-16 text-center text-text-sub">
              {errorMessage}
            </p>

          /* 빈 결과 상태 */
          ) : movies.length === 0 ? (
            <p className="py-16 text-center text-text-sub">
              검색 결과가 없어요.
            </p>

          /* 성공 상태 */
          ) : (
            <ul className="grid grid-cols-2 gap-4">
              {movies.map((movie) => {
                const posterUrl = getTmdbPosterUrl(movie.poster_path);

                return (
                  <li
                    key={movie.id}
                    className="flex gap-4 rounded-lg border border-border bg-surface p-4"
                  >
                    {posterUrl ? (
                      <img
                        src={posterUrl}
                        alt={`${movie.title} 포스터`}
                        className="h-[120px] w-[80px] shrink-0 rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-[120px] w-[80px] shrink-0 items-center justify-center rounded-md bg-gray-200 text-center text-xs text-gray-500">
                        이미지 없음
                      </div>
                    )}

                    <div className="flex min-w-0 flex-col">
                      <h3 className="truncate font-bold">
                        {movie.title}
                      </h3>

                      <p className="text-xs text-text-muted">
                        {movie.original_title}
                      </p>

                      <p className="mt-1 text-xs text-text-sub">
                        {movie.release_date}
                      </p>

                      <p className="mt-2 line-clamp-2 text-sm text-text-sub">
                        {movie.overview}
                      </p>

                      <Link
                        to="/movies/$movieId"
                        params={{ movieId: String(movie.id) }}
                        className="mt-2 text-sm font-semibold text-primary"
                      >
                        상세보기 →
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </main>
  );
}