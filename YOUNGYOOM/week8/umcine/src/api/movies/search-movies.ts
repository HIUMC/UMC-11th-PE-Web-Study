import { tmdbClient } from "../tmdb-client";
import type { TmdbMovieListResponse } from "./models";

interface SearchMoviesRequest {
  query: string;
  page?: number;
}

type SearchMoviesResponse = TmdbMovieListResponse;

//얘는 query랑 페이지 번호를 둘 다 받아서 검색 -> 검색 후 데이터 받아옴
function searchMovies({ query, page = 1 }: SearchMoviesRequest) {
  return tmdbClient
    .get("search/movie", {
      searchParams: {
        query,
        language: "ko-KR",
        include_adult: false,
        page,
      },
    })
    .json<SearchMoviesResponse>();
}

export { searchMovies, type SearchMoviesRequest, type SearchMoviesResponse };
