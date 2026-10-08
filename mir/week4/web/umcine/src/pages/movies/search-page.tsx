import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import { BookmarkButton } from "../../components/bookmark-button";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });

  const [prevQuery, setPrevQuery] = useState(query);
  const [searchText, setSearchText] = useState(query ?? "");

  if (query !== prevQuery) {
    setPrevQuery(query); // 이전 값을 현재 값으로 갱신
    setSearchText(query ?? ""); // input 검색어도 새 query로 동기화
  }

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

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
      ) : (
        <>
          <h2>‘{query}’ 검색 결과</h2>
          <p>영화 {searchResults.length}편</p>
          {searchResults.length === 0 ? (
            <p>검색 결과가 없어요.</p>
          ) : (
            <ul>
              {searchResults.map((movie) => (
                <li key={movie.id}>
                  <div style={{ marginBottom: "8px" }}>
                    <BookmarkButton movieId={movie.id} />
                  </div>
                  <img src={movie.posterPath} alt={`${movie.title} 포스터`} />
                  <h3>{movie.title}</h3>
                  <p>{movie.originalTitle}</p>
                  <p>{movie.releaseDate}</p>
                  <p>{movie.overview}</p>
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                  >
                    상세 보기
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
