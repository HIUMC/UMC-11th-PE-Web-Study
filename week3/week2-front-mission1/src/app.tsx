import { useMemo, useState } from "react";
import { movies as initialMovies } from "./datas/movies";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";
import type { Movie } from "./types/movie";
import { cn } from "./utils/cn";

const pageContentClass =
  "mx-auto w-[min(1136px,calc(100%_-_144px))] pt-14 pb-[72px] max-[1024px]:w-[min(720px,calc(100%_-_80px))] max-[720px]:w-[calc(100%_-_48px)] max-[720px]:pt-10 max-[480px]:w-[calc(100%_-_32px)] max-[480px]:pt-8 max-[480px]:pb-14";

const pageHeadingClass =
  "mb-8 flex items-end justify-between max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-4";

const eyebrowClass = "mb-2.5 text-[13px] font-extrabold text-[#f04252]";

type Route =
  | { page: "home" }
  | { page: "search"; query: string }
  | { page: "detail"; movieId: number | null };

function getRoute(): Route {
  const { pathname, search } = window.location;
  const params = new URLSearchParams(search);

  if (pathname === "/search") {
    return { page: "search", query: params.get("query")?.trim() ?? "" };
  }

  const movieMatch = pathname.match(/^\/movies\/([^/]+)$/);
  if (movieMatch) {
    const movieId = Number(movieMatch[1]);
    return { page: "detail", movieId: Number.isNaN(movieId) ? null : movieId };
  }

  return { page: "home" };
}

function findMovies(movies: Movie[], query: string) {
  const normalizedQuery = query.toLocaleLowerCase();

  return movies.filter((movie) =>
    [movie.title, movie.originalTitle, movie.overview, movie.releaseDate]
      .join(" ")
      .toLocaleLowerCase()
      .includes(normalizedQuery),
  );
}

function App() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);
  const route = getRoute();

  const toggleBookmark = (movieId: number) => {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  };

  const searchResults = useMemo(() => {
    if (route.page !== "search" || !route.query) {
      return [];
    }

    return findMovies(movies, route.query);
  }, [movies, route]);

  return (
    <div className="min-h-screen bg-[#101114] [background:radial-gradient(circle_at_17%_0%,rgba(45,70,116,0.22),transparent_28rem),linear-gradient(180deg,#14151a_0%,#101114_34%,#0d0e11_100%)]">
      <Header
        searchQuery={route.page === "search" ? route.query : ""}
        activePage={
          route.page === "home"
            ? "movies"
            : route.page === "search"
              ? "search"
              : undefined
        }
      />
      {route.page === "home" && (
        <HomePage
          movies={movies}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onToggleBookmark={toggleBookmark}
        />
      )}
      {route.page === "search" && (
        <SearchPage
          query={route.query}
          results={searchResults}
          onToggleBookmark={toggleBookmark}
        />
      )}
      {route.page === "detail" && (
        <MovieDetailPage
          movie={movies.find((movie) => movie.id === route.movieId)}
          onToggleBookmark={toggleBookmark}
        />
      )}
    </div>
  );
}

interface HomePageProps {
  movies: Movie[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onToggleBookmark: (movieId: number) => void;
}

function HomePage({
  movies,
  currentPage,
  onPageChange,
  onToggleBookmark,
}: HomePageProps) {
  return (
    <main className={pageContentClass}>
      <section className={pageHeadingClass} aria-labelledby="movie-list-title">
        <div>
          <p className={eyebrowClass}>UMCINE MOVIES</p>
          <h1
            className="text-[40px] leading-[1.2] font-extrabold text-white max-[480px]:text-[32px]"
            id="movie-list-title"
          >
            영화 목록
          </h1>
          <p className="mt-3 text-base text-[#969ca8]">
            지금 가장 보고 싶은 영화를 찾아보세요.
          </p>
        </div>
        <p className="mb-1.5 text-[15px] font-bold text-[#aeb4bf]">
          <strong className="text-2xl text-white">{movies.length}</strong>{" "}
          movies
        </p>
      </section>
      <MovieGrid movies={movies} onToggleBookmark={onToggleBookmark} />
      <Pagination currentPage={currentPage} onPageChange={onPageChange} />
    </main>
  );
}

interface SearchPageProps {
  query: string;
  results: Movie[];
  onToggleBookmark: (movieId: number) => void;
}

function SearchPage({ query, results, onToggleBookmark }: SearchPageProps) {
  return (
    <main className={pageContentClass}>
      <section className={pageHeadingClass} aria-labelledby="search-title">
        <div>
          <p className={eyebrowClass}>SEARCH</p>
          <h1
            className="text-[40px] leading-[1.2] font-extrabold text-white max-[480px]:text-[32px]"
            id="search-title"
          >
            영화 검색
          </h1>
          {query ? (
            <p className="mt-3 text-base text-[#969ca8]">
              "{query}" 검색 결과 {results.length}개
            </p>
          ) : (
            <p className="mt-3 text-base text-[#969ca8]">
              검색어를 입력해 주세요.
            </p>
          )}
        </div>
      </section>

      {!query && (
        <p className="py-[34px] text-lg font-bold text-[#d8dde6]">
          검색어가 없어요. 상단 검색창에 영화 제목을 입력해 주세요.
        </p>
      )}
      {query && results.length === 0 && (
        <p className="py-[34px] text-lg font-bold text-[#d8dde6]">
          검색 결과가 없어요.
        </p>
      )}
      {results.length > 0 && (
        <MovieGrid movies={results} onToggleBookmark={onToggleBookmark} />
      )}
    </main>
  );
}

interface MovieDetailPageProps {
  movie?: Movie;
  onToggleBookmark: (movieId: number) => void;
}

function MovieDetailPage({ movie, onToggleBookmark }: MovieDetailPageProps) {
  if (!movie) {
    return (
      <main className={pageContentClass}>
        <p className="py-[34px] text-lg font-bold text-[#d8dde6]">
          영화를 찾을 수 없어요.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-76px)]">
      <section
        className="relative flex min-h-[calc(100vh-76px)] items-center bg-cover bg-center p-[72px] max-[720px]:p-10 max-[720px]:px-6 max-[480px]:items-start"
        style={{ backgroundImage: `url(${movie.backdropPath})` }}
        aria-labelledby="detail-title"
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,11,14,0.94)_0%,rgba(10,11,14,0.72)_48%,rgba(10,11,14,0.24)_100%),linear-gradient(180deg,rgba(10,11,14,0.1),#101114_100%)]" />
        <div className="relative mx-auto grid w-[min(1136px,100%)] grid-cols-[260px_minmax(0,640px)] items-center gap-[42px] max-[720px]:grid-cols-[150px_minmax(0,1fr)] max-[720px]:gap-6 max-[480px]:grid-cols-1">
          <img
            className="w-full rounded-lg shadow-[0_28px_70px_rgba(0,0,0,0.5)] max-[480px]:w-[min(210px,70vw)]"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
          <div>
            <p className={eyebrowClass}>MOVIE DETAIL</p>
            <h1
              className="text-[54px] leading-[1.1] font-bold text-white max-[720px]:text-[38px] max-[480px]:text-[32px]"
              id="detail-title"
            >
              {movie.title}
            </h1>
            <p className="mt-3 text-xl font-bold text-[#c7ccd5]">
              {movie.originalTitle}
            </p>
            <p className="mt-6 text-[22px] font-extrabold text-white">
              {movie.tagline}
            </p>
            <div
              className="mt-6 flex flex-wrap gap-2.5"
              aria-label="영화 정보"
            >
              <span className="rounded-lg bg-white/12 px-3 py-2 text-sm font-extrabold text-[#eef1f6]">
                {movie.releaseDate}
              </span>
              <span className="rounded-lg bg-white/12 px-3 py-2 text-sm font-extrabold text-[#eef1f6]">
                {movie.runtime}
              </span>
              <span className="rounded-lg bg-white/12 px-3 py-2 text-sm font-extrabold text-[#eef1f6]">
                {movie.genres.join(" / ")}
              </span>
            </div>
            <p className="mt-[26px] max-w-[600px] text-lg text-[#d4d9e2]">
              {movie.overview}
            </p>
            <button
              className={cn(
                "mt-8 inline-flex min-h-12 items-center gap-2.5 rounded-lg bg-white/14 px-[18px] font-extrabold text-white",
                movie.isBookmarked && "bg-[#f04252]",
              )}
              type="button"
              aria-pressed={movie.isBookmarked}
              onClick={() => onToggleBookmark(movie.id)}
            >
              <img
                className="h-5 w-5"
                src={
                  movie.isBookmarked
                    ? "/icons/bookmark.svg"
                    : "/icons/bookmark-outline.svg"
                }
                alt=""
              />
              {movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
