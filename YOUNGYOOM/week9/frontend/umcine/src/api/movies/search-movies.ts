import ky from "ky";
import type { TmdbMovieListResponse } from "./models";

interface SearchMoviesRequest {
  query: string;
  page?: number;
}

type SearchMoviesResponse = TmdbMovieListResponse;

//얘는 query랑 페이지 번호를 둘 다 받아서 검색 -> 검색 후 데이터 받아옴
function searchMovies({ query, page = 1 }: SearchMoviesRequest) {
  return ky
    .get("/api/tmdb", { searchParams: { type: "search", query, page } })
    .json<SearchMoviesResponse>();
}

export { searchMovies, type SearchMoviesRequest, type SearchMoviesResponse };
