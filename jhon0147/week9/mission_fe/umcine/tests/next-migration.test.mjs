import test from "node:test";
import assert from "node:assert/strict";
import { readPage, movieListHref, movieSearchHref } from "../src/utils/movie-location.ts";
import { createTmdbRequest } from "../src/api/tmdb-request.ts";

test("이전 라우터와 동일하게 페이지를 1~500 사이로 제한한다", () => {
  for (const value of [null, "", "0", "-1", "1.5", "501", "NaN", "1e99"]) {
    assert.equal(readPage(value), 1);
  }
  assert.equal(readPage("500"), 500);
  assert.equal(movieListHref(1), "/");
  assert.equal(movieListHref(2), "/?page=2");
});

test("검색어의 한글과 URL 특수 문자를 보존하고 새 검색은 1페이지로 이동한다", () => {
  const keyword = "영화 & 사랑/#?";
  const url = new URL(movieSearchHref(` ${keyword} `, 3), "https://umcine.test");
  assert.equal(url.searchParams.get("query"), keyword);
  assert.equal(url.searchParams.get("page"), "3");
  assert.equal(new URL(movieSearchHref(keyword), url).searchParams.has("page"), false);
  assert.equal(movieSearchHref("  ", 4), "/search");
});

test("서버용 영화 요청은 허용한 경로만 호출한다", async () => {
  let calls = 0;
  const request = createTmdbRequest({ baseUrl: "https://tmdb.test/3", token: "server-token" }, async () => {
    calls++;
    return Response.json({});
  });
  for (const path of ["account", "movie/0", "movie/-1", "movie/1/credits", "movie/9007199254740992", "https://other.test", "../account"]) {
    assert.equal((await request(path)).status, 404, path);
  }
  assert.equal(calls, 0);
  for (const path of ["movie/popular", "search/movie", "movie/550"]) assert.equal((await request(path)).status, 200);
  assert.equal(calls, 3);
});

test("TMDB 토큰 누락은 외부 요청 없이 503으로 안내한다", async () => {
  for (const token of ["", "YOUR_TMDB_READ_ACCESS_TOKEN"]) {
    const request = createTmdbRequest({ baseUrl: "https://tmdb.test/3", token }, async () => {
      assert.fail("토큰이 없으면 외부 요청을 하면 안 된다");
    });
    assert.equal((await request("movie/popular")).status, 503);
  }
});

test("서버 토큰은 헤더에만 넣고 허용하지 않은 검색 조건은 전달하지 않는다", async () => {
  let received;
  const request = createTmdbRequest({ baseUrl: "https://tmdb.test/3/", token: " server-token " }, async (url, options) => {
    received = { url: new URL(url), options };
    return Response.json({ title: "영화" });
  });
  await request("search/movie", new URLSearchParams({ query: "영화 & 사랑", page: "2", api_key: "ignored", access_token: "ignored" }));
  assert.equal(received.url.pathname, "/3/search/movie");
  assert.equal(received.url.searchParams.get("query"), "영화 & 사랑");
  assert.equal(received.url.searchParams.get("language"), "ko-KR");
  assert.equal(received.url.searchParams.has("api_key"), false);
  assert.equal(received.url.searchParams.has("access_token"), false);
  assert.equal(received.options.headers.Authorization, "Bearer server-token");
  assert.equal(received.options.cache, "no-store");
  assert.ok(received.options.signal instanceof AbortSignal);
  assert.equal(received.url.href.includes("server-token"), false);
});

test("TMDB 오류 상태와 요청 취소는 호출자에게 전달한다", async () => {
  const controller = new AbortController();
  const request = createTmdbRequest({ baseUrl: "https://tmdb.test/3", token: "server-token" }, async (_url, options) => {
    options.signal.throwIfAborted();
    return Response.json({ status_message: "not found" }, { status: 404 });
  });
  assert.equal((await request("movie/550")).status, 404);
  controller.abort();
  await assert.rejects(request("movie/550", undefined, controller.signal), { name: "AbortError" });
});
