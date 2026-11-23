import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "@/api/auth/login";
import { useAuthStore } from "@/stores/auth-store";
import { getErrorMessage } from "@/utils/get-error-message";

export function useLoginMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: login,
    onSuccess: async (response) => {
      // 토큰 저장 → 이전 사용자 캐시 무효화 → 홈 이동
      setAccessToken(response.result.accessToken);
      alert(response.message);
      await queryClient.invalidateQueries({ queryKey: ["members", "me"] });
      router.push("/");
    },
    onError: async (error) => {
      alert(await getErrorMessage(error, "로그인에 실패했어요. 다시 시도해 주세요."));
    },
  });
}
