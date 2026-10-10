import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { BookmarkButton } from "../../components/bookmark-button";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const [prevQuery, setPrevQuery] = useState(query);

  if (query !== prevQuery) {
    setPrevQuery(query);
    setSearchText(query ?? "");
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

  if (!normalizedQuery) {
    return (
      <main className="flex flex-col items-center px-20 pb-24 pt-[209px]">
        <h1 className="text-[44px] font-bold tracking-[-1.98px] text-[#17191e]">
          어떤 영화를 찾고 있나요?
        </h1>
        <form
          onSubmit={handleSubmit}
          className="mt-9 flex h-[74px] w-full max-w-[790px] items-center gap-3.5 rounded-xl border-2 border-[#17191e] bg-white pl-[23px] pr-[19px] shadow-[0_12px_30px_rgba(12,15,20,0.12)]"
        >
          <img src="/icons/search.svg" alt="" className="size-6" />
          <input
            aria-label="검색어"
            placeholder="예: 스파이더맨"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="flex-1 bg-transparent text-sm font-bold text-[#17191e] outline-none placeholder:font-normal placeholder:text-[#969da8]"
          />
          <button
            type="submit"
            className="h-[42px] rounded-lg bg-[#17191e] px-4 text-sm font-extrabold text-white"
          >
            검색
          </button>
        </form>
        <p className="mt-4 text-sm text-[#969da8]">검색어를 입력해 주세요.</p>
      </main>
    );
  }

  return (
    <main className="px-20 py-6">
      <h1 className="text-[38px] font-bold leading-[44px] tracking-[-1.71px] text-[#17191e]">
        영화 검색
      </h1>
      <form
        onSubmit={handleSubmit}
        className="mt-[17px] flex h-[54px] items-center gap-[18px] rounded-[9px] border border-[#e3e6eb] bg-white pl-[15px] pr-2.5"
      >
        <img src="/icons/search.svg" alt="" className="size-6" />
        <input
          aria-label="검색어"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          className="flex-1 bg-transparent text-sm font-bold text-[#17191e] outline-none"
        />
        <button
          type="button"
          aria-label="검색어 지우기"
          onClick={() => setSearchText("")}
        >
          <img src="/icons/close.svg" alt="" className="size-6" />
        </button>
        <button
          type="submit"
          className="h-[42px] rounded-lg bg-[#17191e] px-4 text-sm font-extrabold text-white"
        >
          다시 검색
        </button>
      </form>

      <div className="flex h-[54px] items-center justify-between border-y border-[#e3e6eb]">
        <h2 className="text-lg font-bold text-[#17191e]">
          '{query}' 검색 결과
        </h2>
        <p className="text-xs text-[#969da8]">영화 {searchResults.length}편</p>
      </div>

      {searchResults.length === 0 ? (
        <p className="py-20 text-center text-sm text-[#606774]">
          검색 결과가 없어요.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-x-10">
          {searchResults.map((movie) => (
            <li
              key={movie.id}
              className="flex gap-[18px] border-b border-[#e3e6eb] py-5"
            >
              <div className="relative h-[190px] w-[126px] shrink-0">
                <img
                  src={movie.posterPath}
                  alt={`${movie.title} 포스터`}
                  className="size-full rounded-[10px] object-cover"
                />
                <BookmarkButton movieId={movie.id} movieTitle={movie.title} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col items-start gap-2 pt-1">
                <h3 className="text-lg font-bold leading-[24.3px] text-[#17191e]">
                  {movie.title}
                </h3>
                <p className="flex gap-2 text-xs text-[#969da8]">
                  <span>{movie.originalTitle}</span>
                  <span>{movie.releaseDate}</span>
                </p>
                <p className="text-[12.5px] leading-[20.25px] text-[#606774]">
                  {movie.overview}
                </p>
                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                  className="flex items-center gap-1 text-xs font-extrabold text-blue-600"
                >
                  상세 보기
                  <img src="/icons/arrow-right.svg" alt="" className="size-4" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
