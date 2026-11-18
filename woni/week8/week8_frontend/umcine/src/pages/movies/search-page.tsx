import { Link, useNavigate, useSearch } from "@tanstack/react-router";
// 변경: useQuery import 추가
import { useQuery } from "@tanstack/react-query";
// 변경: useEffect 제거
import { useState, type SubmitEvent } from "react";
// 변경: TmdbMovieListItem import 제거 (더 이상 쓰지 않음)
import { movieQueries } from "../../api/movies/movie-queries";
import { BookmarkButton } from "../../components/bookmark-button";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const [prevQuery, setPrevQuery] = useState(query);

  // 변경: movies, isLoading, errorMessage useState 3개 삭제

  if (query !== prevQuery) {
    setPrevQuery(query);
    setSearchText(query ?? "");
  }

  const normalizedQuery = query?.trim() ?? "";

  // 변경: useEffect 전체를 useQuery로 교체
  // 검색어가 query key에 포함되므로 검색어마다 캐시가 따로 생김
  // enabled: 공백을 제거한 검색어가 있을 때만 요청
  const searchQuery = useQuery(movieQueries.search(normalizedQuery));
  // 변경: 서버 응답에서 영화 목록을 꺼냄
  const movies = searchQuery.data?.results ?? [];

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

  let resultsContent;
  // 변경: isLoading -> searchQuery.isLoading
  if (searchQuery.isLoading) {
    resultsContent = (
      <p className="py-20 text-center text-sm text-[#606774]">
        검색 결과를 불러오는 중이에요.
      </p>
    );
    // 변경: errorMessage -> searchQuery.isError, 메시지는 문구를 직접 표시
  } else if (searchQuery.isError) {
    resultsContent = (
      <p className="py-20 text-center text-sm text-[#606774]">
        검색 결과를 불러오지 못했어요.
      </p>
    );
  } else if (movies.length === 0) {
    resultsContent = (
      <p className="py-20 text-center text-sm text-[#606774]">
        검색 결과가 없어요.
      </p>
    );
  } else {
    resultsContent = (
      <ul className="grid grid-cols-2 gap-x-10">
        {movies.map((movie) => {
          const posterUrl = getTmdbPosterUrl(movie.poster_path);

          return (
            <li
              key={movie.id}
              className="flex gap-[18px] border-b border-[#e3e6eb] py-5"
            >
              <div className="relative h-[190px] w-[126px] shrink-0">
                {posterUrl ? (
                  <img
                    src={posterUrl}
                    alt={`${movie.title} 포스터`}
                    className="size-full rounded-[10px] object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center rounded-[10px] bg-gray-300 text-sm text-gray-500">
                    이미지 없음
                  </div>
                )}
                <BookmarkButton movieId={movie.id} movieTitle={movie.title} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col items-start gap-2 pt-1">
                <h3 className="text-lg font-bold leading-[24.3px] text-[#17191e]">
                  {movie.title}
                </h3>
                <p className="flex gap-2 text-xs text-[#969da8]">
                  <span>{movie.original_title}</span>
                  <span>{movie.release_date.replaceAll("-", ".")}</span>
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
          );
        })}
      </ul>
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
        {/* 변경: !isLoading && !errorMessage -> searchQuery.isSuccess */}
        {searchQuery.isSuccess && (
          <p className="text-xs text-[#969da8]">영화 {movies.length}편</p>
        )}
      </div>

      {resultsContent}
    </main>
  );
}
