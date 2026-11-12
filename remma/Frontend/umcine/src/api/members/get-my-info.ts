import { apiClient } from "../api-client";
import type { ApiResponse } from "../api-response";
import type { MemberResult } from "./signup";

export type MyInfoResponse = ApiResponse<MemberResult>;

/** 내 정보 조회 쿼리 키 (헤더와 내 정보 페이지가 같은 캐시를 공유해요) */
export const myInfoQueryKey = ["members", "me"] as const;

export async function getMyInfo() {
  const response = await apiClient.get("members/me").json<MyInfoResponse>();

  if (!response.result) {
    throw new Error(response.message || "내 정보를 불러오지 못했어요.");
  }
  return response.result;
}
