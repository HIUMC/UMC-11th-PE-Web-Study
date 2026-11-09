import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

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
    //영화 검색 화면
    return(
      <main className="min-h-[calc(100vh-91px)] bg-[#f6f7f9]">
        <section
          className="
            box-border flex h-[582px] w-full justify-center
            px-[72px] pb-[210px] pt-[209px]"
        >
          <div
            className="
              flex h-[163px] w-[790px] max-w-full
              flex-col items-center gap-9"
          >
            <h1
              className="
              m-0 h-[53px] w-[425px] max-w-full
              text-center text-[46px] font-bold leading-[52.44px]
              tracking-[-2.3px] text-[#17191e]"
            >
              어떤 영화를 찾고 있나요?
            </h1>

            <form
              onSubmit={handleSubmit}
              className="
                  box-border flex h-[74px] w-full items-center
                  gap-3.5 rounded-xl border-2 border-[#17191e]
                bg-white pl-[21px] pr-[17px]
                  shadow-[0px_12px_34px_0px_#11131814]
                "
            >
              <img
                src="/icons/movie-icons/search.svg"
                alt=""
                className="h-6 w-6 shrink-0"
              />
              <input
                type="search"
                aria-label="검색어"
                placeholder="예: 스파이더맨"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                className="
                  h-[22px] min-w-0 flex-1 border-0 bg-transparent
                  px-0.5 py-px text-[17px] font-normal leading-none
                  text-[#17191e] outline-none placeholder:text-[#969da8]
                "
              />
              <button
                type="submit"
                className="
                  box-border h-[42px] w-[59px] shrink-0
                  rounded-lg border border-[#17191e] bg-[#17191e]
                  px-4 text-[13px] font-bold leading-4 text-white
                  cursor-pointer
                "
              >
                검색
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

// 영화 검색 결과 화면
  return (
    <main
      className="
        box-border min-h-[937px] w-full
        bg-[#f6f7f9] px-20 py-6
      "
    >
      <div
        className="
          flex h-[115px] w-full
          flex-col gap-[17px]
        "
      >
        <h1 className="m-0 text-[32px] font-extrabold leading-[38px] text-[#17191e]">
          영화 검색
        </h1>

        <form
          onSubmit={handleSubmit}
          className="
            flex min-h-0 flex-1 items-center gap-3
            rounded-lg border border-[#e3e6eb]
            bg-white px-4
          "
        >
          <img
            src="/icons/movie-icons/search.svg"
            alt=""
            className="h-6 w-6 shrink-0 opacity-60"
          />

          <input
            type="search"
            aria-label="검색어"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="
              min-w-0 flex-1 border-0 bg-transparent
              text-sm text-[#17191e] outline-none
            "
          />

          <button
            type="button"
            aria-label="검색어 지우기"
            onClick={() => setSearchText("")}
            className="cursor-pointer border-0 bg-transparent p-0"
          >
            <img
              src="/icons/movie-icons/close.svg"
              alt=""
              className="block h-6 w-6"
            />
          </button>

          <button
            type="submit"
            className="
              h-[42px] shrink-0 cursor-pointer rounded-lg
              border-0 bg-[#17191e] px-4
              text-[13px] font-bold text-white
            "
          >
            다시 검색
          </button>
        </form>
      </div>

      <div
        className="
          flex h-[54px] w-full items-center justify-between
          border-y border-[#e3e6eb]
        "
      >
        <h2 className="m-0 text-sm font-bold text-[#17191e]">
          ‘{query}’ 검색 결과
        </h2>

        <p className="m-0 text-xs text-[#969da8]">
          영화 {searchResults.length}편 · 1페이지
        </p>
      </div>

      {searchResults.length === 0 ? (
        <div className="flex h-[720px] items-center justify-center">
          <p className="m-0 text-sm text-[#606774]">
            검색 결과가 없어요.
          </p>
        </div>
      ) : (
        <ul
          className="
            m-0 grid h-[720px] w-full list-none
            grid-cols-2 grid-rows-3 gap-x-10 p-0
          "
        >
          {searchResults.map((movie) => (
            <li
              key={movie.id}
              className="box-border flex h-[240px] w-full items-center gap-[18px] border-b border-[#e3e6eb] py-5"
            >
              <Link
                to="/movies/$movieId"
                params={{ movieId: String(movie.id) }}
                aria-label={`${movie.title} 상세 보기`}
                className="block h-[190px] w-[126px] shrink-0"
              >
                <img
                  src={movie.posterPath}
                  alt={`${movie.title} 포스터`}
                  className="block h-full w-full rounded-[10px] bg-[#f6f7f9] object-cover"
                />
              </Link>

              <div className="flex h-[199px] min-w-0 flex-1 flex-col gap-2">
                <h3 className="m-0 h-[25px] w-full truncate text-[18px] font-bold leading-[25px] text-[#17191e]">
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="text-inherit no-underline"
                  >
                    {movie.title}
                  </Link>
                </h3>

                <div className="flex h-[14px] w-full items-center gap-2 text-[11px] leading-[14px] text-[#969da8]">
                  <p className="m-0 truncate">{movie.originalTitle}</p>
                  <p className="m-0 shrink-0">{movie.releaseDate}</p>
                </div>

                <p className="m-0 line-clamp-2 h-[41px] w-full overflow-hidden text-[12.5px] font-normal leading-[20.25px] text-[#606774]">
                  {movie.overview}
                </p>

                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                  className="flex h-4 w-[65px] items-center gap-1 text-xs font-bold leading-4 text-[#2563eb] no-underline"
                >
                  <span>상세 보기</span>
                  <img
                    src="/icons/movie-icons/arrow-right.svg"
                    alt=""
                    className="h-3 w-3"
                  />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );

}
