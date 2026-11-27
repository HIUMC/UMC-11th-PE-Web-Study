import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "../api/auth/login";
import { useAuthStore } from "../stores/auth-store";
import { queryKeys } from "./query-keys";

export function useLoginMutation(redirectTo?: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      setAccessToken(response.result.accessToken);
      alert("로그인에 성공했어요.");
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
      router.push(redirectTo ?? "/");
    },
    onError: () => {
      alert("로그인에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
