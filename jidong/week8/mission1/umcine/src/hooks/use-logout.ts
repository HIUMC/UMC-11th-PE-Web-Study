import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../stores/auth-store";
import { queryKeys } from "./query-keys";

// 토큰을 지우고, 이전 회원의 개인 데이터가 다음 로그인에 섞이지 않게 캐시도 지움
export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return () => {
    setAccessToken(null);
    queryClient.removeQueries({ queryKey: queryKeys.me });
    queryClient.removeQueries({ queryKey: queryKeys.favorites });
    navigate({ to: "/" });
  };
}
