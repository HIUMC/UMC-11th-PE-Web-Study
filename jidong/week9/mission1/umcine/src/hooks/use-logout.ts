import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/auth-store";
import { queryKeys } from "./query-keys";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return () => {
    setAccessToken(null);
    queryClient.removeQueries({ queryKey: queryKeys.me });
    queryClient.removeQueries({ queryKey: queryKeys.favorites });
    router.push("/");
  };
}
