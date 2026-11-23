import { queryOptions } from "@tanstack/react-query";
import { getMovies, getMovieDetail } from "./get-movies";
import { searchMovies } from "./search-movies";

// 영화 목록 쿼리 설정
export function movieListOptions(page: number) {
  return queryOptions({
    //데이터를 구분하는 캐시 키 -> page가 바뀌면 다른 키가 되므로 해당 페이지의 데이터를 조회
    queryKey: ["movie", "list", { page }],
    //데이터를 가져옴 -> 현재 페이지 번호를 API 함수로 전달
    queryFn: () => getMovies({ page }),
  });
}

// 영화 검색 쿼리 설정
export function movieSearchOptions(query: string) {
  const normalizedQuery = query.trim();

  return queryOptions({
    //검색어마다 결과를 따로 캐시에 저장
    //검색어가 바뀌면 해당 검색어의 데이터 조회
    queryKey: ["movies", "search", { query: normalizedQuery }],
    //공백 제거한 검색어를 API 함수에 전달
    queryFn: () => searchMovies({ query: normalizedQuery }),
    //검색어가 있을 떄만 자동으로 요청
    //빈 문자열이나 곰백만 입력한 경우에는 요청x
    enabled: normalizedQuery.length > 0,
  });
}

// 영화 상세 쿼리 설정
export function movieDetailOptions(movieId: number) {
  return queryOptions({
    //영화 ID마다 상세 정보를 따로 캐시에 저장
    queryKey: ["movies", "detail", movieId],
    //해당 영화 ID를 API 함수에 전달해 상세정보 요청
    queryFn: () => getMovieDetail({ movieId }),
    //올바른 영화 ID일때만 자동으로 요청
    enabled: Number.isSafeInteger(movieId) && movieId > 0,
  });
}
