import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";

import { BookmarkButton } from "../../components/bookmark-button";

import { searchMovies } from "../../api/movies/search-movies";

import { useQuery } from "@tanstack/react-query";
import { movieSearchOptions } from "../../api/movies/movie-query-options";

export function SearchPage() {
  //URL의 검색 파라미터에서 검색어를 가져옴
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  //검색어 앞뒤 공백을 제거하고, 검색어가 없으면 빈 문자열을 사용
  const normalizedQuery = (query ?? "").trim();

  const searchQuery = useQuery(movieSearchOptions(normalizedQuery));

  //응답에서 결과 목록을 꺼냄
  //데이터가 없다면 -> 빈 배열 사용
  const searchResults = searchQuery.data?.results ?? [];

  //뒤로가기 등으로 URL 검색어 변경시 입력창도 비워짐
  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <>
      {/* 기존 검색 폼과 다른 UI는 여기에 유지해요. */}

      {!normalizedQuery ? (
        <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-6">
          <div className="w-full max-w-[790px]">
            <h1 className="mb-8 text-center text-[38px] font-bold">
              어떤 영화를 찾고 있나요?
            </h1>
            <form
              onSubmit={handleSubmit}
              className="flex w-full items-center gap-4 rounded-lg border-2 border-black bg-white p-3 pl-4 shadow-lg"
            >
              <img src="icons/search.svg" />
              <input
                aria-label="검색어"
                placeholder="예: 스파이더맨"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                className="flex-1 bg-transparent outline-none"
              />
              <button
                type="submit"
                className="cursor-pointer rounded-lg bg-black px-5 py-2 text-white"
              >
                검색
              </button>
            </form>
          </div>
        </main>
      ) : searchQuery.isLoading ? (
        // 데이터가 없는 상태에서 첫 요청이 진행 중이면 로딩 문구를 보여줘요.
        //isPending이면서 실제로 요청중인 상태 = isPending && isFetching = isLoading
        // isPeading : 첫 조회가 아직 성공이나 실패로 끝ㅈ나지 않은 상태
        //캐시가 없다면 요청 전이나 오프라인으로 요청이 멈춘때도 참
        <p>검색 결과를 불러오는 중이에요.</p>
      ) : searchQuery.isError ? (
        // 검색 요청에 실패하면 오류 메시지를 보여줘요.
        <p>{searchQuery.error.message}</p>
      ) : searchQuery.isSuccess && searchResults.length === 0 ? (
        // 검색에 성공했지만 결과가 없으면 안내 문구를 보여줘요.
        <p>검색 결과가 없어요.</p>
      ) : (
        <>
          <main className="mx-auto w-full max-w-[1280px] py-6">
            <h1 className="mb-4 text-[38px] font-bold">영화 검색</h1>

            <form
              onSubmit={handleSubmit}
              className="flex w-full items-center gap-4 rounded-lg border border-gray-200 bg-white p-3 pl-4"
            >
              <img src="icons/search.svg" />
              <input
                aria-label="검색어"
                placeholder="예: 스파이더맨"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                className="flex-1 bg-transparent outline-none"
              />
              <button
                type="submit"
                className="cursor-pointer rounded-lg bg-black px-5 py-2 text-white"
              >
                다시 검색
              </button>
            </form>

            <div className="mt-6 flex items-end justify-between border-b pb-4">
              <h2 className="font-bold text-xl">‘{query}’ 검색 결과</h2>
              <p className="text-sm text-gray-500">
                영화 {searchResults.length}편
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
              {searchResults.map((movie) => (
                <li key={movie.id} className="flex gap-4.5 border-b py-6">
                  <div className="relative shrink-0">
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={`${movie.title} 포스터`}
                        className="h-[190px] w-[126px] rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-[190px] w-[126px] items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-500">
                        포스터 없음
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <BookmarkButton movieId={movie.id} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-bold">{movie.title}</h3>
                    <p className="text-xs text-gray-500">
                      {movie.original_title} · {movie.release_date}
                    </p>
                    <p className="line-clamp-2 text-sm text-gray-700">
                      {movie.overview}
                    </p>
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="text-sm font-medium text-blue-600"
                    >
                      상세 보기 →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </main>
        </>
      )}
    </>
  );
}
