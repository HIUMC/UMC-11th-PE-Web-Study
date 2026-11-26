import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "../api/members/login";
import { useAuthStore } from "../stores/auth-store";
export function useLoginMutation() {
  const client = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      useAuthStore.getState().setAccessToken(response.result.accessToken);
      void client.invalidateQueries({ queryKey: ["members", "me"] });
      void router.push("/");
    },
  });
}
