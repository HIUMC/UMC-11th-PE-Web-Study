import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { movies } from "../../data/movie";
import { useBookmarkStore } from "../../stores/bookmark-store";

const searchIcon = "/icons/movie-icons/movie-icons/search.svg";
const bookmarkIcon = "/icons/movie-icons/movie-icons/bookmark.svg";
const bookmarkOutlineIcon = "/icons/movie-icons/movie-icons/bookmark-outline.svg";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const bookmarkedMovieIds = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

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
    navigate({ search: nextQuery ? { query: nextQuery } : {} });
  }

  function clearSearch() {
    setSearchText("");
  }

  if (!normalizedQuery) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-start justify-center bg-[#F7F8FA] px-5 pt-32 sm:pt-40">
        <section className="w-full max-w-[640px] text-center">
          <h1 className="mb-7 text-2xl font-bold tracking-[-0.03em] text-[#191D23] sm:text-[32px]">
            어떤 영화를 찾고 있나요?
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex h-12 items-center rounded-lg border border-[#191D23] bg-white px-4 shadow-sm"
          >
            <img src={searchIcon} alt="" className="mr-3 h-5 w-5 opacity-60" />
            <input
              aria-label="검색어"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="예: 스파이더맨"
              className="min-w-0 flex-1 bg-transparent text-sm text-[#191D23] outline-none placeholder:text-[#A7ADB7]"
            />
            <button
              type="submit"
              className="ml-3 rounded-md bg-[#191D23] px-4 py-2 text-xs font-semibold text-white transition hover:bg-black"
            >
              검색
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#F7F8FA]">
      <div className="mx-auto max-w-[1100px] px-5 py-7 sm:py-9">
        <h1 className="mb-5 text-[28px] font-bold tracking-[-0.03em] text-[#191D23]">영화 검색</h1>

        <form
          onSubmit={handleSubmit}
          className="flex h-12 items-center rounded-lg border border-[#E1E5EA] bg-white px-4 shadow-sm"
        >
          <img src={searchIcon} alt="" className="mr-3 h-5 w-5 opacity-60" />
          <input
            aria-label="검색어"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#191D23] outline-none"
          />
          {searchText && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="검색어 지우기"
              className="mr-3 flex h-7 w-7 items-center justify-center text-xl text-[#8A929E]"
            >
              ×
            </button>
          )}
          <button
            type="submit"
            className="shrink-0 rounded-md bg-[#191D23] px-4 py-2 text-xs font-semibold text-white transition hover:bg-black"
          >
            다시 검색
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between border-b border-[#E1E5EA] pb-4">
          <h2 className="text-sm font-semibold text-[#191D23]">‘{query}’ 검색 결과</h2>
          <p className="text-xs text-[#9CA3AF]">영화 {searchResults.length}편</p>
        </div>

        {searchResults.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-lg font-semibold text-[#353B45]">검색 결과가 없어요.</p>
            <p className="mt-2 text-sm text-[#8A929E]">다른 검색어로 다시 찾아보세요.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
            {searchResults.map((movie) => (
              <li key={movie.id} className="flex min-w-0 gap-4 border-b border-[#E1E5EA] py-5">
                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                  className="h-[158px] w-[108px] shrink-0 overflow-hidden rounded-lg bg-gray-200"
                >
                  <img
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                    className="h-full w-full object-cover transition duration-200 hover:scale-105"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col py-1">
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="w-fit"
                  >
                    <h3 className="line-clamp-1 text-sm font-bold text-[#191D23] hover:underline">
                      {movie.title}
                    </h3>
                  </Link>
                  <p className="mt-1 line-clamp-1 text-xs text-[#9CA3AF]">
                    {movie.originalTitle} · {movie.releaseDate}
                  </p>
                  <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#68707C]">{movie.overview}</p>
                  <button
                    type="button"
                    onClick={() => toggleBookmark(movie.id)}
                    aria-label={`${movie.title} 북마크 ${
                      bookmarkedMovieIds.includes(movie.id) ? "해제" : "추가"
                    }`}
                    aria-pressed={bookmarkedMovieIds.includes(movie.id)}
                    className="mt-3 flex w-fit items-center gap-1.5 rounded-md border border-[#D8DEE8] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#353B45]"
                  >
                    <img
                      src={
                        bookmarkedMovieIds.includes(movie.id)
                          ? bookmarkIcon
                          : bookmarkOutlineIcon
                      }
                      alt=""
                      className="h-4 w-4"
                    />
                    {bookmarkedMovieIds.includes(movie.id) ? "북마크 해제" : "북마크 추가"}
                  </button>
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="mt-auto w-fit text-xs font-semibold text-[#2F6FED] hover:underline"
                  >
                    상세 보기 →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
