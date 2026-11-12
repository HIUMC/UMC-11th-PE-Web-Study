import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { myInfoQueryKey } from "../api/members/get-my-info";
import { useAuthStore } from "../stores/auth-store";

/** 토큰과 내 정보 캐시를 지우고 홈으로 이동해요. */
export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return async function logout() {
    // 먼저 이동한 뒤 토큰을 지워야 보호된 페이지의 로그인 리다이렉트와 겹치지 않아요.
    await navigate({ to: "/" });
    clearAuth();
    queryClient.removeQueries({ queryKey: myInfoQueryKey });
  };
}
