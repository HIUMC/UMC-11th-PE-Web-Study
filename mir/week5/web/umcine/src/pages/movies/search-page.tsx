import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { searchMovies } from "../../api/movies/search-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { BookmarkButton } from "../../components/bookmark-button";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });

  const [prevQuery, setPrevQuery] = useState(query);
  const [searchText, setSearchText] = useState(query ?? "");

  if (query !== prevQuery) {
    setPrevQuery(query);
    setSearchText(query ?? "");
  }

  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const normalizedQuery = (query ?? "").trim();

  useEffect(() => {
    if (!normalizedQuery) {
      return;
    }

    let ignore = false;

    async function fetchSearch() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await searchMovies({ query: normalizedQuery });
        if (!ignore) {
          setMovies(response.results);
        }
      } catch {
        if (!ignore) {
          setErrorMessage("검색 결과를 불러오지 못했어요.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    fetchSearch();

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
    <main>
      <h1>영화 검색</h1>
      <form onSubmit={handleSubmit}>
        <input
          aria-label="검색어"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <button type="submit">검색</button>
      </form>

      {!normalizedQuery ? (
        <p>검색어를 입력해 주세요.</p>
      ) : isLoading ? (
        <p>검색 결과를 불러오는 중이에요.</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : movies.length === 0 ? (
        <p>검색 결과가 없어요.</p>
      ) : (
        <>
          <h2>‘{query}’ 검색 결과</h2>
          <p>영화 {movies.length}편</p>
          <ul>
            {movies.map((movie) => {
              const posterUrl = getTmdbPosterUrl(movie.poster_path);
              return (
                <li key={movie.id}>
                  <div style={{ marginBottom: "8px" }}>
                    <BookmarkButton movieId={movie.id} />
                  </div>
                  {posterUrl ? (
                    <img src={posterUrl} alt={`${movie.title} 포스터`} />
                  ) : (
                    <div>이미지 없음</div>
                  )}
                  <h3>{movie.title}</h3>
                  <p>{movie.original_title}</p>
                  <p>{movie.release_date}</p>
                  <p>{movie.overview}</p>
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                  >
                    상세 보기
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </main>
  );
}
