import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { searchMovies } from "../../api/movies/search-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { cn } from "../../utils/cn";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { ArrowRightIcon, CloseIcon, SearchIcon } from "../../components/icons";
import { BookmarkButton } from "../../components/movies/bookmark-button";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  const normalizedQuery = query?.trim() ?? "";
  const hasQuery = normalizedQuery !== "";

  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(hasQuery);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

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
  }, [normalizedQuery]);

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

  const isSuccess = !isLoading && !errorMessage;

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
            <h2 className="text-xl font-bold">‘{normalizedQuery}’ 검색 결과</h2>
            {isSuccess && (
              <p className="text-sm text-muted">영화 {movies.length}편</p>
            )}
          </div>

          {isLoading ? (
            <p className="py-10 text-muted">검색 결과를 불러오는 중이에요.</p>
          ) : errorMessage ? (
            <p className="py-10 text-muted">{errorMessage}</p>
          ) : movies.length === 0 ? (
            <p className="py-10 text-muted">조건에 맞는 영화가 없어요.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-x-14 max-[960px]:grid-cols-1">
              {movies.map((movie) => {
                const posterUrl = getTmdbPosterUrl(movie.poster_path);
                const releaseDate = movie.release_date.replace(/-/g, ".");

                return (
                  <li
                    key={movie.id}
                    className="flex gap-5 border-b border-line py-7"
                  >
                    <div className="relative shrink-0">
                      {posterUrl ? (
                        <img
                          src={posterUrl}
                          alt={`${movie.title} 포스터`}
                          className="aspect-[2/3] w-[120px] rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex aspect-[2/3] w-[120px] items-center justify-center rounded-lg bg-line text-[13px] text-muted">
                          이미지 없음
                        </div>
                      )}
                      <BookmarkButton
                        movieId={movie.id}
                        className="absolute right-1.5 top-1.5 size-8"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <h3 className="text-xl font-bold">{movie.title}</h3>
                      <p className="mt-1 text-sm text-muted">
                        {movie.original_title} {releaseDate}
                      </p>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
                        {movie.overview || "줄거리 정보가 없어요."}
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
                );
              })}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}