import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import BookmarkButton from "../../components/bookmark-button";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });

  const normalizedQuery = query?.trim().toLowerCase() ?? "";

  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

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
            key={query ?? ""}
            name="query"
            aria-label="검색어"
            placeholder="영화 제목을 입력하세요"
            defaultValue={query ?? ""}
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
              <ul className="search-results">
                {searchResults.map((movie) => (
                  <li key={movie.id} className="search-result">
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                    >
                      <img
                        src={movie.posterPath}
                        alt={`${movie.title} 포스터`}
                      />
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

                      <p>{movie.originalTitle}</p>
                      <p>{movie.releaseDate}</p>
                      <p>{movie.overview}</p>
                      <BookmarkButton movieId={movie.id} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </main>
  );
}