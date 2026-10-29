import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { searchMovies } from "../../api/movies/search-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "../../components/bookmark-button";

export function SearchPage() {
  const { query = "" } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query);

  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. 첫 번째 useEffect 대신 query가 바뀔 때 상태를 맞추거나 아래처럼 수정
  useEffect(() => {
    let ignore = false;
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return;
    }

    // 비동기 흐름 안에서 상태 업데이트
    Promise.resolve().then(() => {
      if (!ignore) {
        setIsLoading(true);
        setErrorMessage(null);
      }
    });

    searchMovies({ query: normalizedQuery })
      .then((response) => {
        if (!ignore) setMovies(response.results);
      })
      .catch(() => {
        if (!ignore) {
          setMovies([]);
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

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  const normalizedQuery = query.trim();

  return (
    <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
      {!normalizedQuery ? (
        /* 1. 빈 검색어 상태 (3주차 Figma 중앙 검색창 레이아웃) */
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
          <h1 className="mb-6 text-2xl font-extrabold text-gray-950">
            어떤 영화를 찾고 있나요?
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-xl items-center rounded-full border border-gray-900 bg-white px-4 py-2"
          >
            <input
              aria-label="검색어"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="예: 스파이더맨"
              className="w-full px-2 text-sm text-gray-900 outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-gray-950 px-5 py-2 text-xs font-semibold text-white hover:bg-gray-800"
            >
              검색
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-500">검색어를 입력해 주세요.</p>
        </div>
      ) : (
        /* 검색어가 입력된 상태 */
        <>
          <form
            onSubmit={handleSubmit}
            className="mb-8 flex w-full max-w-xl items-center rounded-full border border-gray-300 bg-white px-4 py-1.5"
          >
            <input
              aria-label="검색어"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="예: 스파이더맨"
              className="w-full px-2 text-sm text-gray-900 outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-gray-950 px-4 py-1.5 text-xs font-semibold text-white hover:bg-gray-800"
            >
              검색
            </button>
          </form>

          {/* 2. 로딩 → 3. 오류 → 4. 빈 결과 → 5. 성공 순서로 표시 */}
          {isLoading ? (
            <p className="py-20 text-center text-gray-500">
              검색 결과를 불러오는 중이에요.
            </p>
          ) : errorMessage ? (
            <p className="py-20 text-center text-red-600">{errorMessage}</p>
          ) : (
            <>
              <h2 className="text-xl font-extrabold text-gray-950">
                ‘{query}’ 검색 결과
              </h2>
              <p className="mt-1 mb-6 text-xs text-gray-500">
                영화 {movies.length}편
              </p>

              {movies.length === 0 ? (
                <p className="py-24 text-center text-sm text-gray-500">
                  검색 결과가 없어요.
                </p>
              ) : (
                <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {movies.map((movie) => {
                    const posterUrl = getTmdbPosterUrl(movie.poster_path);
                    return (
                      <li
                        key={movie.id}
                        className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs"
                      >
                        <div className="group relative aspect-[2/3] w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                          <Link
                            to="/movies/$movieId"
                            params={{ movieId: String(movie.id) }}
                            className="block h-full w-full"
                          >
                            {posterUrl ? (
                              <img
                                src={posterUrl}
                                alt={`${movie.title} 포스터`}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xs text-gray-500">
                                이미지 없음
                              </div>
                            )}
                          </Link>
                          <BookmarkButton movieId={movie.id} variant="overlay" />
                        </div>

                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <Link
                              to="/movies/$movieId"
                              params={{ movieId: String(movie.id) }}
                            >
                              <h3 className="font-bold text-gray-900 hover:text-blue-600">
                                {movie.title}
                              </h3>
                            </Link>
                            <p className="text-xs text-gray-500">
                              {movie.original_title}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              {movie.release_date}
                            </p>
                            <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                              {movie.overview}
                            </p>
                          </div>
                          <Link
                            to="/movies/$movieId"
                            params={{ movieId: String(movie.id) }}
                            className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:underline"
                          >
                            상세 보기
                          </Link>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}

export default SearchPage;