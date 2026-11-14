import { authApi } from "../auth-api";
import type { MemberInfo } from "./me";

export interface UpdateMeRequest {
  nickname: string;
}

interface UpdateMeResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MemberInfo;
}

export async function updateMe(body: UpdateMeRequest) {
  const response = await authApi.patch("members/me", { json: body }).json<UpdateMeResponse>();
  if (!response.isSuccess || !response.result) {
    throw new Error(response.message || "내 정보 수정에 실패했어요.");
  }
  return response;
}
