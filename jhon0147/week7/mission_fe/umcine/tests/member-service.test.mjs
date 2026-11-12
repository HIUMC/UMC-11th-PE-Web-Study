import test from "node:test";
import assert from "node:assert/strict";
import ky, { HTTPError } from "ky";
import { createMemberService } from "../src/api/members/member-service.ts";
import { validateSignupForm, isNicknameValid } from "../src/utils/auth-validation.ts";

function setup(body, status = 200) {
  const requests = [];
  const client = ky.create({
    baseUrl: "http://localhost:8080/", retry: 0,
    fetch: async input => {
      const request = input instanceof Request ? input : new Request(input);
      requests.push(request.clone());
      return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
    },
  });
  return { service: createMemberService(client), requests };
}

test("중복 확인은 기존 백엔드의 result.available을 읽고 false도 유지", async () => {
  for (const available of [true, false]) {
    const { service } = setup({ isSuccess: true, result: { available } });
    assert.deepEqual(await service.checkEmailDuplicate("movie@example.com"), { available });
  }
});

test("워크북 예시의 available 응답도 처리", async () => {
  const { service } = setup({ available: true });
  assert.deepEqual(await service.checkNicknameDuplicate("영화좋아"), { available: true });
});

test("중복 확인 값은 앞뒤 공백을 제거하고 경로 문자로 인코딩", async () => {
  const { service, requests } = setup({ available: true });
  await service.checkEmailDuplicate("  movie+7@example.com  ");
  await service.checkNicknameDuplicate(" 영화/팬#1 ");
  assert.equal(requests[0].method, "GET");
  assert.equal(new URL(requests[0].url).pathname, "/members/email/movie%2B7%40example.com");
  assert.equal(new URL(requests[1].url).pathname, "/members/nickname/" + encodeURIComponent("영화/팬#1"));
  assert.equal(requests[0].headers.has("Authorization"), false);
});

test("빈 중복 확인은 요청하지 않고 잘못된 응답을 성공으로 취급하지 않음", async () => {
  const { service, requests } = setup({ available: "true" });
  await assert.rejects(service.checkEmailDuplicate("  "), /입력/);
  assert.equal(requests.length, 0);
  await assert.rejects(service.checkEmailDuplicate("movie@example.com"), /응답 형식/);
});

test("회원가입은 확인 비밀번호를 제외하고 비밀번호 원문을 보존", async () => {
  const { service, requests } = setup({
    isSuccess: true, code: "COMMON201", message: "회원가입에 성공했습니다.",
    result: { memberId: 3, email: "movie@example.com", nickname: "영화좋아" },
  }, 201);
  const response = await service.signup({
    email: " movie@example.com ", nickname: " 영화좋아 ", password: " Abc123! ", passwordConfirm: " Abc123! ",
  });
  assert.equal(response.result.memberId, 3);
  assert.equal(requests[0].method, "POST");
  assert.equal(new URL(requests[0].url).pathname, "/members");
  assert.deepEqual(await requests[0].json(), { email: "movie@example.com", nickname: "영화좋아", password: " Abc123! " });
});

test("409 응답은 재시도 없이 실패로 전달", async () => {
  const { service, requests } = setup({ isSuccess: false, message: "이미 사용 중인 이메일입니다." }, 409);
  await assert.rejects(service.signup({ email: "movie@example.com", nickname: "영화좋아", password: "Abcd123!" }), error =>
    error instanceof HTTPError && error.response.status === 409 && error.data.message === "이미 사용 중인 이메일입니다.");
  assert.equal(requests.length, 1);
});

test("HTTP 성공이어도 서버 실패 표시와 결과 누락은 오류로 처리", async () => {
  const failed = setup({ isSuccess: false, message: "가입할 수 없습니다." });
  await assert.rejects(failed.service.checkEmailDuplicate("movie@example.com"), /가입할 수 없습니다/);
  const malformed = setup({ isSuccess: true, code: "COMMON201", message: "성공", result: { memberId: "3" } }, 201);
  await assert.rejects(malformed.service.signup({ email: "movie@example.com", nickname: "영화좋아", password: "Abcd123!" }), /응답 형식/);
});

test("입력 조건의 경계값과 비밀번호 확인을 검사", () => {
  const form = { email: " movie@example.com ", nickname: " 영화좋아 ", password: "Abcd123!", passwordConfirm: "Abcd123!" };
  assert.ok(Object.values(validateSignupForm(form)).every(Boolean));
  for (const password of ["abcd123!", "ABCD123!", "Abcdefg!", "Abcd1234", "Abc12!", "Abcd123! ", "Abcd123?", "Abcd123!한"]) {
    assert.equal(validateSignupForm({ ...form, password }).password, false, password);
  }
  assert.equal(validateSignupForm({ ...form, passwordConfirm: "" }).passwordConfirm, false);
  assert.equal(validateSignupForm({ ...form, email: "a@@b.com" }).email, false);
  assert.equal(isNicknameValid(" 가 "), false);
  assert.equal(isNicknameValid("가".repeat(12)), true);
  assert.equal(isNicknameValid("가".repeat(13)), false);
});
