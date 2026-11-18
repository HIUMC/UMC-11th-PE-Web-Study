import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../api/members/get-my-info";
import { useAuthStore } from "../stores/auth-store";

export function useMyInfo() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["members", "me"],
    queryFn: ({ signal }) => getMyInfo(signal),
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
