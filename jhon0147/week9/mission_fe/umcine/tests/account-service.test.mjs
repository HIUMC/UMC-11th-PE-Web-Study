import test from "node:test";
import assert from "node:assert/strict";
import ky, { HTTPError } from "ky";
import { QueryClient } from "@tanstack/react-query";
import { createAccountService } from "../src/api/account-service.ts";
import { getMemberId } from "../src/utils/member-id.ts";
import { clearPrivateQueries } from "../src/lib/auth-session.ts";

function setup(respond) {
  const requests = [];
  const client = ky.create({
    baseUrl: "https://example.test/v8/", retry: 0,
    fetch: async input => {
      const request = input instanceof Request ? input : new Request(input);
      requests.push(request.clone());
      const { body, status = 200 } = respond(request);
      return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
    },
  });
  return { service: createAccountService(client), requests };
}

const envelope = result => ({ isSuccess: true, code: "COMMON200", message: "성공", result });
const rating = { ratingId: 12, movieId: 550, score: 5, comment: "기존 후기", createdAt: "2026-11-01T00:00:00Z", updatedAt: "2026-11-01T00:00:00Z" };

test("로그인은 이메일 공백만 제거하고 비밀번호 원문을 유지", async () => {
  const { service, requests } = setup(() => ({ body: envelope({ nickname: "영화팬", accessToken: "test-token" }) }));
  assert.equal((await service.login({ email: " movie@example.com ", password: " Abc123! " })).accessToken, "test-token");
  assert.equal(new URL(requests[0].url).pathname, "/v8/auth/login");
  assert.equal(requests[0].headers.has("Authorization"), false);
  assert.deepEqual(await requests[0].json(), { email: "movie@example.com", password: " Abc123! " });
});

test("즐겨찾기는 result 배열, 회원별 평점은 직접 반환된 배열을 사용", async () => {
  const { service } = setup(request => ({ body: request.url.endsWith("/ratings") ? [rating] : envelope([]) }));
  assert.deepEqual(await service.getFavorites(), []);
  assert.deepEqual(await service.getRatings(7), [rating]);
  const empty = setup(() => ({ body: [] }));
  assert.deepEqual(await empty.service.getRatings(7), []);
});

test("즐겨찾기 등록과 해제에는 favoriteId 대신 movieId를 사용하고 200/null 처리", async () => {
  const { service, requests } = setup(request => ({ body: envelope(request.method === "POST" ? { favoriteId: 88, movieId: 550, createdAt: "2026-11-01" } : null) }));
  await service.addFavorite(550);
  assert.equal(await service.removeFavorite(550), null);
  assert.deepEqual(await requests[0].json(), { movieId: 550 });
  assert.equal(requests[1].method, "DELETE");
  assert.equal(new URL(requests[1].url).pathname, "/v8/favorites/550");
});

test("평점 수정은 ratingId로 요청하고 score와 기존 후기를 함께 전달", async () => {
  const { service, requests } = setup(() => ({ body: envelope(rating) }));
  await service.createRating({ movieId: 550, score: 5, comment: "기존 후기" });
  await service.updateRating({ ratingId: 12, score: 4, comment: "기존 후기" });
  await service.removeRating(12);
  assert.equal(new URL(requests[1].url).pathname, "/v8/ratings/12");
  assert.deepEqual(await requests[1].json(), { score: 4, comment: "기존 후기" });
  assert.equal(requests[2].method, "DELETE");
  assert.equal(new URL(requests[2].url).pathname, "/v8/ratings/12");
});

test("409 평점 중복과 HTTP 200 내부 실패를 성공 데이터로 취급하지 않음", async () => {
  const failed = setup(() => ({ status: 409, body: { isSuccess: false, code: "RATING409_1", message: "이미 이 영화에 평점을 남기셨습니다.", result: null } }));
  await assert.rejects(failed.service.createRating({ movieId: 550, score: 5, comment: "" }), error =>
    error instanceof HTTPError && error.response.status === 409 && error.data.code === "RATING409_1");
  assert.equal(failed.requests.length, 1);
  const invalid = setup(() => ({ body: { isSuccess: false, message: "수정할 수 없습니다.", result: null } }));
  await assert.rejects(invalid.service.updateMe({ nickname: "영화팬" }), /수정할 수 없습니다/);
});

test("JWT sub는 양의 정수만 경로에 사용하고 손상된 토큰은 거부", () => {
  const token = payload => "header." + Buffer.from(JSON.stringify(payload)).toString("base64url") + ".signature";
  assert.equal(getMemberId(token({ sub: "27", nickname: "영화팬" })), 27);
  assert.equal(getMemberId(token({ sub: 7 })), 7);
  for (const sub of [null, true, "", "1.5", "-1", "1e3", " ", {}, 0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(getMemberId(token({ sub })), null);
  }
  assert.equal(getMemberId(null), null);
  assert.equal(getMemberId("손상된.토큰"), null);
});

test("로그아웃 시 진행 중인 회원 요청을 취소하고 영화 캐시는 유지", async () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity } } });
  queryClient.setQueryData(["movies", "detail", 550], { title: "영화" });
  queryClient.setQueryData(["members", "me"], { nickname: "회원A" });
  queryClient.setQueryData(["favorites", 1, "list"], [{ movieId: 550 }]);
  let release;
  let canceled = false;
  const request = queryClient.fetchQuery({
    queryKey: ["ratings", 1],
    queryFn: ({ signal }) => {
      signal.addEventListener("abort", () => { canceled = true; });
      return new Promise(resolve => { release = resolve; });
    },
  }).catch(() => undefined);
  await clearPrivateQueries(queryClient);
  release([rating]);
  await request;
  assert.equal(canceled, true);
  assert.equal(queryClient.getQueryData(["members", "me"]), undefined);
  assert.equal(queryClient.getQueryData(["favorites", 1, "list"]), undefined);
  assert.equal(queryClient.getQueryData(["ratings", 1]), undefined);
  assert.deepEqual(queryClient.getQueryData(["movies", "detail", 550]), { title: "영화" });
  queryClient.clear();
});
