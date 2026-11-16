import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { login } from "../api/auth/login";
import { useAuthStore } from "../stores/auth-store";
import { queryKeys } from "./query-keys";

// redirectTo: 로그인이 필요한 페이지에서 튕겨 왔으면 로그인 후 그 페이지로 돌려보냄
export function useLoginMutation(redirectTo?: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      setAccessToken(response.result.accessToken);
      alert("로그인에 성공했어요.");
      // 토큰이 바뀌었으니 내 정보 캐시를 stale로 만들어서 다시 조회하게 함
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
      if (redirectTo) {
        navigate({ href: redirectTo });
      } else {
        navigate({ to: "/" });
      }
    },
    onError: () => {
      alert("로그인에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
