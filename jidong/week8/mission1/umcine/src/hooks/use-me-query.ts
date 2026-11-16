import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/members/me";
import { useAuthStore } from "../stores/auth-store";
import { queryKeys } from "./query-keys";

const FIVE_MINUTES = 5 * 60 * 1000;

// 헤더, 마이페이지, 수정 화면이 같은 key로 내 정보 캐시를 같이 씀
export function useMeQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: queryKeys.me,
    queryFn: getMe,
    // 토큰이 있을 때만 조회함
    enabled: Boolean(accessToken),
    // 내 정보는 자주 안 바뀌어서 5분 동안 fresh로 취급함
    staleTime: FIVE_MINUTES,
    // 401로 토큰을 지운 뒤 같은 조회를 자동 재시도하지 않게 끔
    retry: false,
  });
}
