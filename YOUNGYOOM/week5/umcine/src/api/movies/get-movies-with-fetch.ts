import { env } from "../../config/env"; //API 응답 주소 가져옴
import type { TmdbMovieListResponse } from "./models"; //응답 데이터 구조 정의

type GetMoviesWithFetchResponse = TmdbMovieListResponse; //가존 타입에 -> 응답 타입이라고 리네이밍

//비동기 함수 정의
//페이지 기본값 1, Promise 내부 : response 응답 타입
async function getMoviesWithFetch(
  page = 1,
): Promise<GetMoviesWithFetchResponse> {
  //숫자인 page를 문자열로 바꾸고 검색 조건 붙임(페이지)
  const searchParams = new URLSearchParams({
    language: "ko-KR",
    page: String(page),
  });

  //서버에 fetch 요청 보냄
  const response = await fetch(
    `${env.tmdbApiBaseUrl}/movie/popular?${searchParams}`,
    {
      headers: {
        Authorization: `Bearer ${env.tmdbAccessToken}`,
      },
    },
  );

  //실패 응답 처리
  if (!response.ok) {
    throw new Error(`영화 목록 요청에 실패했어요: ${response.status}`);
  }

  return response.json();
}

export { getMoviesWithFetch, type GetMoviesWithFetchResponse };
