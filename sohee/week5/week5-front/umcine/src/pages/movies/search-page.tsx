import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { searchMovies } from "../../api/movies/search-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbImageUrl } from "../../utils/movies/tmdb-image";

interface SearchResult {
  query: string;
  movies: TmdbMovieListItem[];
  errorMessage: string | null;
}

function SearchPage() {
  const query = useSearch({ from: "/search" }).query?.trim() ?? "";
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState(query);
  const [prevQuery, setPrevQuery] = useState(query);
  const [result, setResult] = useState<SearchResult | null>(null);

  // URL의 query가 바뀌면(뒤로 가기 등) 입력창도 맞춰요.
  if (query !== prevQuery) {
    setPrevQuery(query);
    setKeyword(query);
  }

  useEffect(() => {
    if (!query) return;

    let ignore = false;

    searchMovies({ query })
      .then((response) => {
        if (!ignore) setResult({ query, movies: response.results, errorMessage: null });
      })
      .catch(() => {
        if (!ignore) setResult({ query, movies: [], errorMessage: "검색 결과를 불러오지 못했어요." });
      });

    return () => {
      ignore = true;
    };
  }, [query]);

  // 현재 검색어에 대한 응답이 아직 없으면 로딩 중이에요.
  const isCurrentResult = result?.query === query;
  const movies = isCurrentResult ? result.movies : [];
  const errorMessage = isCurrentResult ? result.errorMessage : null;
  const isLoading = query !== "" && !isCurrentResult;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = keyword.trim();
    navigate({ to: "/search", search: nextQuery ? { query: nextQuery } : {} });
  };

  return (
    <main className="page-content">
      <section className="page-heading" aria-labelledby="search-title">
        <div>
          <p className="eyebrow">UMCINE SEARCH</p>
          <h1 id="search-title">영화 검색</h1>
          <p className="page-description">제목이나 원제로 영화를 찾아보세요.</p>
        </div>
      </section>

      <form className="search-form" role="search" onSubmit={handleSubmit}>
        <img src="/icons/search.svg" alt="" />
        <input
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="영화 제목을 입력하세요"
          aria-label="영화 검색어"
        />
        <button type="submit">검색</button>
      </form>

      {!query ? (
        <p className="search-empty">검색어를 입력해 주세요.</p>
      ) : isLoading ? (
        <p className="search-empty">검색 중이에요...</p>
      ) : errorMessage ? (
        <p className="search-empty">{errorMessage}</p>
      ) : (
        <>
          <p className="search-summary">
            <strong>‘{query}’</strong> 검색 결과 <strong>{movies.length}</strong>개
          </p>
          {movies.length === 0 ? (
            <p className="search-empty">‘{query}’에 대한 검색 결과가 없어요.</p>
          ) : (
            <ul className="search-results">
              {movies.map((movie) => (
                <li key={movie.id}>
                  <Link className="search-result" to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
                    <img
                      className="search-result-poster"
                      src={getTmdbImageUrl(movie.poster_path, "w185")}
                      alt={`${movie.title} 포스터`}
                    />
                    <div className="search-result-info">
                      <h2>{movie.title}</h2>
                      <p className="movie-original-title">{movie.original_title}</p>
                      <p className="search-result-date">개봉일 {movie.release_date || "미정"}</p>
                      <p className="search-result-overview">{movie.overview}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}

export default SearchPage;
