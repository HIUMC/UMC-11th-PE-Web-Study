import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRating,
  deleteRating,
  getMemberRatings,
  updateRating,
} from "@/api/ratings/ratings";
import { useAuthStore } from "@/stores/auth-store";
import { getMemberIdFromToken } from "@/utils/auth/get-member-id-from-token";
import { getErrorMessage } from "@/utils/get-error-message";

// 로그인한 회원의 평점 목록 (토큰의 sub에서 memberId 추출)
export function useMyRatingsQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getMemberIdFromToken(accessToken);

  return useQuery({
    queryKey: ["members", memberId, "ratings"],
    queryFn: () => getMemberRatings(memberId as number),
    enabled: memberId !== null,
  });
}

function useRatingMutation<TVariables, TResult>(
  mutationFn: (variables: TVariables) => Promise<TResult>,
  successMessage: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      // 평점 목록 캐시를 무효화해 서버 데이터로 다시 동기화
      queryClient.invalidateQueries({ queryKey: ["members"] });
      alert(successMessage);
    },
    onError: async (error) => {
      alert(await getErrorMessage(error, "평점 처리에 실패했어요."));
    },
  });
}

export const useCreateRatingMutation = () =>
  useRatingMutation(createRating, "평점을 등록했어요.");
export const useUpdateRatingMutation = () =>
  useRatingMutation(updateRating, "평점을 수정했어요.");
export const useDeleteRatingMutation = () =>
  useRatingMutation(deleteRating, "평점을 삭제했어요.");
