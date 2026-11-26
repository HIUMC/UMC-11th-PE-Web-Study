import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/members/me";
import { useAuthStore } from "../stores/auth-store";
import { queryKeys } from "./query-keys";

const FIVE_MINUTES = 5 * 60 * 1000;

export function useMeQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: queryKeys.me,
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: FIVE_MINUTES,
    retry: false,
  });
}
