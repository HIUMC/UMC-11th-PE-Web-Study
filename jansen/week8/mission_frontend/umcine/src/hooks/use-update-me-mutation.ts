import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "@/api/members/update-me";
import { getErrorMessage } from "@/utils/get-error-message";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: (response) => {
      // 응답에 최신 회원 정보가 있으므로 재조회 없이 캐시를 직접 갱신
      queryClient.setQueryData(["members", "me"], response.result);
      alert(response.message);
    },
    onError: async (error) => {
      alert(await getErrorMessage(error, "정보 수정에 실패했어요."));
    },
  });
}
