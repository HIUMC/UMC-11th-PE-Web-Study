import { apiClient, type ApiResponse } from "../api-client";

type Member = { memberId: number; email: string; nickname: string };

export type SignupRequest = {
  email: string;
  nickname: string;
  password: string;
};

export type DuplicateField = "email" | "nickname";

export async function checkDuplicate(field: DuplicateField, value: string) {
  const response = await apiClient
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
  const response = await apiClient
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
