import assert from "node:assert/strict";

// Run against a running production server; no browser automation is used.
const base = process.env.SMOKE_BASE_URL || "http://localhost:3000";
const cases = [
  ["/", 200, "영화 목록"],
  ["/login", 200, "로그인"],
  ["/signup", 200, "회원가입"],
  ["/search?query=batman", 200, "영화 검색"],
  ["/movies/550", 200, "영화 상세"],
  ["/movies/invalid", 200, "올바르지 않은 영화 번호"],
  ["/my-info", 200, "로그인 상태를 확인"],
  ["/my-info/edit", 200, "로그인 상태를 확인"],
  ["/missing-page", 404, "페이지를 찾을 수"],
];
for (const [path, status, marker] of cases) {
  const response = await fetch(new URL(path, base));
  const html = await response.text();
  assert.equal(response.status, status, path);
  assert.ok(html.includes(marker), `${path}: expected content`);
  assert.ok(html.includes('<html lang="ko"'), `${path}: Korean document`);
  console.log(`PASS ${path} (${status})`);
}
const blocked = await fetch(new URL("/api/tmdb/account", base));
assert.equal(blocked.status, 404, "TMDB endpoint allowlist");
console.log("PASS TMDB endpoint allowlist");

if (process.env.SMOKE_LIVE_TMDB === "1") {
  for (const path of ["movie/popular?page=1", "search/movie?query=batman", "movie/550"]) {
    const response = await fetch(new URL(`/api/tmdb/${path}`, base));
    assert.equal(response.status, 200, path);
    const data = await response.json();
    assert.ok(path === "movie/550" ? data.id === 550 : data.results.length > 0, path);
    console.log(`PASS live TMDB ${path}`);
  }
}
