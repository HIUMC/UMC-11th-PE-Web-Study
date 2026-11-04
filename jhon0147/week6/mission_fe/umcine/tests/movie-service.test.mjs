import test from "node:test";
import assert from "node:assert/strict";
import ky, { HTTPError } from "ky";
import { createMovieService } from "../src/api/movie-service.ts";
import { toMoviePage, toMovie, toImageUrl } from "../src/api/movie-mappers.ts";

const movie = {
  id: 550, title: "테스트 영화", original_title: "Test Movie", release_date: "2026-10-01",
  poster_path: "/poster.jpg", backdrop_path: "/backdrop.jpg", overview: "테스트 줄거리",
  vote_average: 8.2, runtime: 139, genres: [{ id: 18, name: "드라마" }], tagline: "테스트 문구",
};
const page = { page: 1, results: [movie], total_pages: 3, total_results: 45 };

function setup(body = page, status = 200) {
  const requests = [];
  const client = ky.create({
    retry: 0,
    headers: { Authorization: "Bearer test-token" },
    fetch: async (input) => {
      const request = input instanceof Request ? input : new Request(input);
      request.signal.throwIfAborted();
      requests.push(request);
      return new Response(JSON.stringify(body), {
        status, headers: { "Content-Type": "application/json" },
      });
    },
  });
  return { service: createMovieService(client, "https://api.themoviedb.org/3/"), requests };
}

test("인기 영화는 GET·페이지·한국어·공통 인증 헤더를 함께 보낸다", async () => {
  const { service, requests } = setup();
  const result = await service.getPopularMovies(2);
  assert.equal(requests.length, 1);
  const request = requests[0];
  const url = new URL(request.url);
  assert.equal(request.method, "GET");
  assert.equal(url.pathname, "/3/movie/popular");
  assert.equal(url.searchParams.get("page"), "2");
  assert.equal(url.searchParams.get("language"), "ko-KR");
  assert.equal(request.headers.get("Authorization"), "Bearer test-token");
  assert.equal(result.results[0].originalTitle, "Test Movie");
  assert.equal(result.results[0].posterPath, "https://image.tmdb.org/t/p/w500/poster.jpg");
  assert.equal(result.totalPages, 3);
});

test("검색어의 한글·공백·&를 URL 조회 조건으로 보존한다", async () => {
  const { service, requests } = setup();
  await service.searchMovies("  배트맨 & 슈퍼맨  ", 3);
  const url = new URL(requests[0].url);
  assert.equal(url.pathname, "/3/search/movie");
  assert.equal(url.searchParams.get("query"), "배트맨 & 슈퍼맨");
  assert.equal(url.searchParams.get("page"), "3");
  assert.equal(url.searchParams.get("include_adult"), "false");
  assert.equal(requests[0].headers.get("Authorization"), "Bearer test-token");
});

test("빈 검색어에는 네트워크 요청을 보내지 않는다", async () => {
  const { service, requests } = setup();
  assert.deepEqual(await service.searchMovies("   "), {
    page: 1, results: [], totalPages: 0, totalResults: 0,
  });
  assert.equal(requests.length, 0);
});

test("상세 API는 영화 ID를 경로에 넣고 표시용 데이터로 변환한다", async () => {
  const { service, requests } = setup(movie);
  const result = await service.getMovieDetails(550);
  assert.equal(new URL(requests[0].url).pathname, "/3/movie/550");
  assert.equal(result.runtime, "139분");
  assert.deepEqual(result.genres, ["드라마"]);
  assert.equal(result.voteAverage, 8.2);
});

test("잘못된 상세 ID는 서버에 보내기 전에 거부한다", async () => {
  const { service, requests } = setup();
  for (const id of [0, -1, NaN, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
    await assert.rejects(service.getMovieDetails(id), /올바른 영화 번호/);
  }
  assert.equal(requests.length, 0);
});

for (const status of [401, 404, 429]) {
  test("HTTP " + status + " 응답은 Ky의 HTTPError로 전달된다", async () => {
    const { service } = setup({ status_message: "error" }, status);
    await assert.rejects(service.getPopularMovies(), (error) =>
      error instanceof HTTPError && error.response.status === status);
  });
}

test("빈 결과 배열은 오류가 아닌 정상 응답으로 유지한다", () => {
  const result = toMoviePage({ page: 1, results: [], total_pages: 0, total_results: 0 });
  assert.deepEqual(result.results, []);
  assert.equal(result.totalResults, 0);
});

test("문자열 results와 잘못된 영화 필드는 실제 값 검사에서 거부한다", () => {
  assert.throws(() => toMoviePage({ ...page, results: "영화 없음" }), /배열/);
  assert.throws(() => toMoviePage(null), /형식/);
  assert.throws(() => toMoviePage({ ...page, results: [{ ...movie, id: "550" }] }), /영화 ID/);
  assert.throws(() => toMoviePage({ ...page, results: [{ ...movie, title: null }] }), /영화 제목/);
});

test("이미지·줄거리·상영 시간 누락은 표시용 대체 값으로 변환한다", () => {
  const result = toMovie({ id: 1, title: "제목" });
  assert.equal(result.posterPath, "/images/poster-placeholder.svg");
  assert.equal(result.overview, "등록된 줄거리가 없습니다.");
  assert.equal(result.runtime, "상영 시간 정보 없음");
  assert.equal(toImageUrl("//other.example/unsafe"), "/images/poster-placeholder.svg");
});

test("토큰 설정 확인에서 실패하면 네트워크를 호출하지 않는다", async () => {
  let called = false;
  const client = ky.create({ fetch: async () => { called = true; return new Response("{}"); } });
  const service = createMovieService(client, "https://api.themoviedb.org/3", () => {
    throw new Error("토큰 설정 필요");
  });
  await assert.rejects(service.getPopularMovies(), /토큰 설정 필요/);
  assert.equal(called, false);
});

test("AbortSignal 취소는 요청 Promise를 취소 오류로 종료한다", async () => {
  const controller = new AbortController();
  controller.abort();
  const { service, requests } = setup();
  await assert.rejects(service.getPopularMovies(1, controller.signal), (error) =>
    error.name === "AbortError");
  assert.equal(requests.length, 0);
});

