import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/members/me";

export function useCurrentMember(enabled: boolean) {
  return useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
