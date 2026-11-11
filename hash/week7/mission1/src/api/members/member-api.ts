import ky, { isHTTPError } from "ky";
import { env } from "../../config/env";

type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

type Member = { memberId: number; email: string; nickname: string };

export type SignupRequest = {
  email: string;
  nickname: string;
  password: string;
};

export type DuplicateField = "email" | "nickname";

const memberClient = ky.create({
  baseUrl: env.apiBaseUrl.replace(/\/+$/, "") + "/",
  retry: 0,
});

export async function checkDuplicate(field: DuplicateField, value: string) {
  const response = await memberClient
    .get("members/" + field + "/" + encodeURIComponent(value), {
      cache: "no-store",
    })
    .json<ApiResponse<{ available: boolean }>>();

  if (response.isSuccess !== true || typeof response.result?.available !== "boolean") {
    throw new Error("중복 확인 응답 형식이 올바르지 않아요.");
  }

  return response.result.available;
}

export async function signup(body: SignupRequest) {
  const response = await memberClient
    .post("members", { json: body })
    .json<ApiResponse<Member>>();

  if (
    response.isSuccess !== true ||
    !Number.isSafeInteger(response.result?.memberId) ||
    typeof response.message !== "string"
  ) {
    throw new Error("회원가입 응답 형식이 올바르지 않아요.");
  }

  return response;
}

export function readMemberApiError(error: unknown) {
  if (isHTTPError(error)) {
    const data = error.data;
    return {
      status: error.response.status,
      code: data && typeof data === "object" && "code" in data ? data.code : undefined,
      message:
        data && typeof data === "object" && "message" in data &&
        typeof data.message === "string" && data.message.trim()
          ? data.message
          : "서버가 요청을 처리하지 못했어요. 다시 시도해 주세요.",
    };
  }

  return {
    status: undefined,
    code: undefined,
    message: "응답을 받지 못했어요. 서버 주소와 실행 상태를 확인해 주세요.",
  };
}
