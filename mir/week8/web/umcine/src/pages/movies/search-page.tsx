import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchMoviesQueryOptions } from "../../api/movies/search-movies";
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

  const normalizedQuery = (query ?? "").trim();

  const searchQuery = useQuery(
    searchMoviesQueryOptions({ query: normalizedQuery }),
  );

  const movies = searchQuery.data?.results ?? [];

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
      ) : searchQuery.isLoading ? (
        <p>검색 결과를 불러오는 중이에요.</p>
      ) : searchQuery.isError ? (
        <p>{searchQuery.error.message}</p>
      ) : searchQuery.isSuccess && movies.length === 0 ? (
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
