import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import BookmarkButton from "../../components/bookmark-button";
import { searchMovies } from "../../api/movies/search-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });

  return <SearchResults key={query ?? ""} query={query ?? ""} />;
}

function SearchResults({ query }: { query: string }) {
  const navigate = useNavigate({ from: "/search" });
  const normalizedQuery = query.trim();

  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(Boolean(normalizedQuery));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    if (!normalizedQuery) return;

    searchMovies({ query: normalizedQuery })
      .then((response) => {
        if (!ignore) {
          setMovies(response.results);
          setTotalResults(response.total_results);
        }
      })
      .catch(() => {
        if (!ignore) {
          setErrorMessage("검색 결과를 불러오지 못했어요.");
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [normalizedQuery]);

  return (
    <main className="main">
      <div className="page-content">
        <h1>영화 검색</h1>

        <form
          className="search-form"
          onSubmit={(event) => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);
            const nextQuery = String(formData.get("query") ?? "").trim();

            void navigate({
              search: nextQuery ? { query: nextQuery } : {},
            });
          }}
        >
          <input
            name="query"
            aria-label="검색어"
            placeholder="영화 제목을 입력하세요"
            defaultValue={query}
          />
          <button type="submit">검색</button>
        </form>

        {!normalizedQuery ? (
          <p>검색어를 입력해 주세요.</p>
        ) : (
          <>
            <h2>‘{query}’ 검색 결과</h2>

            {isLoading ? (
              <p role="status">검색 결과를 불러오는 중이에요.</p>
            ) : errorMessage ? (
              <p role="alert">{errorMessage}</p>
            ) : movies.length === 0 ? (
              <p>검색 결과가 없어요.</p>
            ) : (
              <>
                <p>
                  영화 {totalResults}편 · 현재 {movies.length}편 표시
                </p>

                <ul className="search-results">
                  {movies.map((movie) => {
                    const posterUrl = getTmdbPosterUrl(movie.poster_path);

                    return (
                      <li key={movie.id} className="search-result">
                        <Link
                          to="/movies/$movieId"
                          params={{ movieId: String(movie.id) }}
                        >
                          {posterUrl ? (
                            <img
                              className="search-poster"
                              src={posterUrl}
                              alt={`${movie.title} 포스터`}
                            />
                          ) : (
                            <div className="search-poster image-placeholder">
                              이미지 없음
                            </div>
                          )}
                        </Link>

                        <div>
                          <h3>
                            <Link
                              to="/movies/$movieId"
                              params={{ movieId: String(movie.id) }}
                            >
                              {movie.title}
                            </Link>
                          </h3>

                          <p>{movie.original_title}</p>
                          <p>{movie.release_date}</p>
                          <p>{movie.overview}</p>

                          <BookmarkButton movieId={movie.id} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}