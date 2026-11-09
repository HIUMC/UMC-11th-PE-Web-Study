import { useState, type SubmitEvent } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "../../api/movies/search-movies";
import { getTmdbImageUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const normalizedQuery = query?.trim() ?? "";
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState(normalizedQuery);
  const [prevQuery, setPrevQuery] = useState(normalizedQuery);

  // URL의 query가 바뀌면(뒤로 가기 등) 입력창도 맞춰요.
  if (normalizedQuery !== prevQuery) {
    setPrevQuery(normalizedQuery);
    setKeyword(normalizedQuery);
  }

  const searchQuery = useQuery({
    queryKey: ["movies", "search", { query: normalizedQuery }],
    queryFn: () => searchMovies({ query: normalizedQuery }),
    enabled: normalizedQuery.length > 0,
  });

  const searchResults = searchQuery.data?.results ?? [];

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
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

      {!normalizedQuery ? (
        <p className="search-empty">검색어를 입력해 주세요.</p>
      ) : searchQuery.isLoading ? (
        <p className="search-empty">검색 중이에요...</p>
      ) : searchQuery.isError ? (
        <p className="search-empty">검색 결과를 불러오지 못했어요. ({searchQuery.error.message})</p>
      ) : (
        <>
          <p className="search-summary">
            <strong>‘{normalizedQuery}’</strong> 검색 결과 <strong>{searchResults.length}</strong>개
          </p>
          {searchResults.length === 0 ? (
            <p className="search-empty">‘{normalizedQuery}’에 대한 검색 결과가 없어요.</p>
          ) : (
            <ul className="search-results">
              {searchResults.map((movie) => (
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
