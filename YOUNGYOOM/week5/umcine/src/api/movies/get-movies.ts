import { tmdbClient } from "../tmdb-client";
import type { TmdbMovieListResponse, TmdbMovieDetail } from "./models";

interface GetMoviesRequest {
  page?: number;
}

/*interface TmdbMovieListResponse {
  page: number;
  results: TmdbMovieListItem[]; <-이부분을 사용하게됨
  total_pages: number;
  total_results: number;
} */
type GetMoviesResponse = TmdbMovieListResponse;

//전달받은 객체에서 props(page) 꺼냄
//전달받은 객체의 타입 지정
//인자를 안주면 -> 빈 객체(페이지 1, 디폴트)
//getMovies({ page: 2 }); 이런식으로 호출
function getMovies({ page = 1 }: GetMoviesRequest = {}) {
  return tmdbClient
    .get("movie/popular", {
      searchParams: { language: "ko-KR", page },
    })
    .json<GetMoviesResponse>();
  //서버가 준 본문을 JSON으로 읽어서 데이터로 변환
}

interface GetMovieDetailRequest {
  movieId: number;
}

type GetMovieDetailResponse = TmdbMovieDetail;

function getMovieDetail({ movieId }: GetMovieDetailRequest) {
  return tmdbClient
    .get(`movie/${movieId}`, {
      searchParams: { language: "ko-KR" },
    })
    .json<GetMovieDetailResponse>();
}

export {
  getMovies,
  getMovieDetail,
  type GetMoviesRequest,
  type GetMovieDetailRequest,
  type GetMoviesResponse,
  type GetMovieDetailResponse,
};
