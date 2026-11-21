import { authApi } from "../auth-api";
import type { ApiResponse } from "../../types/api";
import { useAuthStore } from "../../stores/auth-store";

//내 정보 조회에 성공하면 result에 들어오는 데이터
export interface MemberInfo {
  memberId: number;
  email: string;
  nickname: string;
  createdAt: string;
}

export async function getMe(): Promise<MemberInfo> {
  const requestToken = useAuthStore.getState().accessToken;

  const response = await authApi
    .get("members/me")
    .json<ApiResponse<MemberInfo>>();
  const member = response.result;

  // 조회 중 로그아웃하거나 계정이 바뀌면 이전 회원 ID를 저장하지 않음
  const { accessToken, setMemberId } = useAuthStore.getState();
  if (requestToken && accessToken === requestToken) {
    setMemberId(member.memberId);
  }

  return member;
}
