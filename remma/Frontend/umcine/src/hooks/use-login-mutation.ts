import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { getApiErrorMessage } from "../api/api-response";
import { favoriteKeys } from "../api/favorites/favorite-keys";
import { myInfoQueryKey } from "../api/members/get-my-info";
import { login } from "../api/members/login";
import { useAuthStore } from "../stores/auth-store";
import { getSafeRedirectPath } from "../utils/auth/redirect";

export const loginMutationOptions = mutationOptions({
  mutationKey: ["auth", "login"] as const,
  mutationFn: login,
});

interface UseLoginMutationOptions {
  redirect?: string;
  onErrorMessage?: (message: string) => void;
}

export function useLoginMutation(options?: UseLoginMutationOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    ...loginMutationOptions,
    onSuccess: (response) => {
      const result = response.result;
      if (!result?.accessToken) {
        const message = response.message || "로그인에 실패했어요.";
        if (options?.onErrorMessage) {
          options.onErrorMessage(message);
        } else {
          alert(message);
        }
        return;
      }

      setAccessToken(result.accessToken);
      // 로그인 후 내 정보와 즐겨찾기 캐시를 무효화해 최신 서버 상태를 조회해요.
      queryClient.invalidateQueries({ queryKey: myInfoQueryKey });
      queryClient.invalidateQueries({ queryKey: favoriteKeys.all });

      router.history.push(getSafeRedirectPath(options?.redirect));
    },
    onError: async (error) => {
      const message = await getApiErrorMessage(
        error,
        "이메일 또는 비밀번호를 확인해 주세요.",
      );
      if (options?.onErrorMessage) {
        options.onErrorMessage(message);
      } else {
        alert(message);
      }
    },
  });
}
