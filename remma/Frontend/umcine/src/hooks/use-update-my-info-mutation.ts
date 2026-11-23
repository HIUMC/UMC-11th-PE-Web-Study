import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { getApiErrorMessage } from "../api/api-response";
import { myInfoQueryKey } from "../api/members/get-my-info";
import type { MemberResult } from "../api/members/signup";
import { updateMyInfo } from "../api/members/update-my-info";

export const updateMyInfoMutationOptions = mutationOptions({
  mutationKey: ["members", "updateMyInfo"] as const,
  mutationFn: updateMyInfo,
});

interface UseUpdateMyInfoMutationOptions {
  onErrorMessage?: (message: string) => void;
}

export function useUpdateMyInfoMutation(options?: UseUpdateMyInfoMutationOptions) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    ...updateMyInfoMutationOptions,
    onSuccess: async (response) => {
      // 응답에 최신 회원 정보가 있으므로 추가 GET /members/me 없이 캐시를 직접 갱신해요.
      if (response.result) {
        queryClient.setQueryData<MemberResult>(myInfoQueryKey, response.result);
      } else {
        await queryClient.invalidateQueries({ queryKey: myInfoQueryKey });
      }
      alert(response.message || "내 정보 수정에 성공했어요.");
      navigate({ to: "/me" });
    },
    onError: async (error) => {
      const message = await getApiErrorMessage(
        error,
        "내 정보 수정에 실패했어요. 다시 시도해 주세요.",
      );
      if (options?.onErrorMessage) {
        options.onErrorMessage(message);
      } else {
        alert(message);
      }
    },
  });
}
