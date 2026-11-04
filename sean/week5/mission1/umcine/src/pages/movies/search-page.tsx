import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { searchMovies } from "../../api/movies/search-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "../../components/movies/bookmark-button";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  const [searchResults, setSearchResults] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim() ?? "";

  useEffect(() => {
    let ignore = false;

    setSearchResults([]);
    setErrorMessage(null);

    if (!normalizedQuery) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    searchMovies({ query: normalizedQuery })
      .then((response) => {
        if (!ignore) setSearchResults(response.results);
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

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="mx-auto max-w-[1200px] px-6 pb-16">
      {!normalizedQuery ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-neutral-900">어떤 영화를 찾고 있나요?</h1>

          <form onSubmit={handleSubmit} className="mt-8 flex w-full max-w-[720px] items-center gap-2 rounded-xl border border-neutral-300 p-2">
            <img className="ml-2 h-5 w-5" src="/icons/search.svg" alt="" />
            <input
              aria-label="검색어"
              placeholder="예: 스파이더맨"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="flex-1 px-1 py-2 text-base outline-none"
            />
            <button type="submit" className="cursor-pointer rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white">
              검색
            </button>
          </form>
        </div>
      ) : (
        <>
          <h1 className="mt-8 mb-5 text-[28px] font-semibold text-neutral-900">영화 검색</h1>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-xl border border-neutral-300 p-2">
            <img className="ml-2 h-5 w-5" src="/icons/search.svg" alt="" />
            <input
              aria-label="검색어"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="flex-1 px-1 py-2 text-base outline-none"
            />
            <button type="submit" className="cursor-pointer rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white">
              다시 검색
            </button>
          </form>

          <div className="mt-6 flex items-baseline justify-between">
            <h2 className="text-lg font-bold text-neutral-900">‘{query}’ 검색 결과</h2>
            {!isLoading && !errorMessage && (
              <p className="text-sm text-neutral-500">영화 {searchResults.length}편</p>
            )}
          </div>

          {isLoading ? (
            <p className="mt-10 text-center text-neutral-500">검색 결과를 불러오는 중이에요.</p>
          ) : errorMessage ? (
            <p className="mt-10 text-center text-red-600">{errorMessage}</p>
          ) : searchResults.length === 0 ? (
            <p className="mt-10 text-center text-neutral-500">검색 결과가 없어요.</p>
          ) : (
            <ul className="mt-4 grid grid-cols-1 gap-x-10 lg:grid-cols-2">
              {searchResults.map((movie) => {
                const posterUrl = getTmdbPosterUrl(movie.poster_path);

                return (
                  <li key={movie.id} className="flex gap-5 border-t border-neutral-200 py-6">
                    <div className="relative h-[170px] w-[115px] shrink-0 overflow-hidden rounded-md">
                      {posterUrl ? (
                        <img
                          className="h-full w-full object-cover"
                          src={posterUrl}
                          alt={`${movie.title} 포스터`}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-xs text-neutral-500">
                          이미지 없음
                        </div>
                      )}
                      <BookmarkButton movieId={movie.id} className="absolute right-1 top-1 h-7 w-7 border-transparent" />
                    </div>

                    <div className="flex flex-1 flex-col">
                      <h3 className="text-lg font-bold text-neutral-900">{movie.title}</h3>
                      <p className="mt-1 text-sm text-neutral-500">
                        {movie.original_title} · {movie.release_date}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-600">{movie.overview}</p>

                      <Link
                        to="/movies/$movieId"
                        params={{ movieId: String(movie.id) }}
                        className="mt-auto pt-3 text-sm font-medium text-blue-600"
                      >
                        상세 보기 →
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </main>
  );
}