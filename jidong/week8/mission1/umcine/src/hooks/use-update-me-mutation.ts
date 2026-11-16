import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isHTTPError } from "ky";
import type { MemberInfo } from "../api/members/me";
import { updateMe } from "../api/members/update-me";
import { queryKeys } from "./query-keys";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: (response) => {
      // 응답 result가 내 정보 조회랑 같은 형태라서 다시 조회 안 하고 캐시에 바로 넣음
      queryClient.setQueryData<MemberInfo>(queryKeys.me, response.result);
      alert("내 정보 수정에 성공했어요.");
    },
    onError: (error) => {
      // 다른 회원이 쓰는 닉네임이면 서버가 409(MEMBER409_1)를 줌
      if (isHTTPError(error) && error.response.status === 409) {
        alert("이미 사용 중인 닉네임이에요.");
        return;
      }
      alert("내 정보 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
