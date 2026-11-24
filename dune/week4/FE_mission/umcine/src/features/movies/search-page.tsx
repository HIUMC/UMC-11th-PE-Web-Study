"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import BookmarkButton from "../../components/bookmark-button";
import { fetchMovieResults } from "../../api/movies/fetch-movie-results";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
  const query = useSearchParams()?.get("query") ?? "";

  return <SearchResults key={query} query={query} />;
}

function SearchResults({ query }: { query: string }) {
  const router = useRouter();
  const normalizedQuery = query.trim();

  const searchQuery = useQuery({
    queryKey: ["movies", "search", { query: normalizedQuery }],
    queryFn: ({ signal }) =>
      fetchMovieResults("/api/movies/search", { query: normalizedQuery }, signal),
    enabled: normalizedQuery.length > 0,
  });

  const movies = searchQuery.data?.results ?? [];
  const totalResults = searchQuery.data?.total_results ?? 0;

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

            const params = new URLSearchParams({ query: nextQuery });
            router.push(nextQuery ? `/search?${params}` : "/search");
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

            {searchQuery.isLoading ? (
              <p role="status">검색 결과를 불러오는 중이에요.</p>
            ) : searchQuery.isError ? (
              <p role="alert">검색 결과를 불러오지 못했어요.</p>
            ) : searchQuery.isSuccess && movies.length === 0 ? (
              <p>검색 결과가 없어요.</p>
            ) : searchQuery.isSuccess ? (
              <>
                <p>
                  영화 {totalResults}편 · 현재 {movies.length}편 표시
                </p>

                <ul className="search-results">
                  {movies.map((movie) => {
                    const posterUrl = getTmdbPosterUrl(movie.poster_path);

                    return (
                      <li key={movie.id} className="search-result">
                        <Link href={`/movies/${movie.id}`}>
                          {posterUrl ? (
                            <Image
                              className="search-poster"
                              src={posterUrl}
                              alt={`${movie.title} 포스터`}
                              width={120}
                              height={180}
                            />
                          ) : (
                            <div className="search-poster image-placeholder">
                              이미지 없음
                            </div>
                          )}
                        </Link>

                        <div>
                          <h3>
                            <Link href={`/movies/${movie.id}`}>
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
            ) : null}
          </>
        )}
      </div>
    </main>
  );
}
