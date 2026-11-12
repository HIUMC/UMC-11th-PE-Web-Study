import { useQuery } from "@tanstack/react-query";
import { getMyInfo, myInfoQueryKey } from "../api/members/get-my-info";
import { useAuthStore } from "../stores/auth-store";

/** 로그인한 경우에만 내 정보를 조회해요. 헤더와 내 정보 페이지가 같은 캐시를 사용해요. */
export function useMyInfoQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: myInfoQueryKey,
    queryFn: getMyInfo,
    enabled: accessToken !== null,
    // 401 등 인증 오류는 재시도해도 결과가 같으므로 바로 실패 처리해요.
    retry: false,
  });
}
