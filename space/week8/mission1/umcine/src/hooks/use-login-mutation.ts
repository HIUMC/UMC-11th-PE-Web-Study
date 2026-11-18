import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { login } from "../api/members/login";
import { useAuthStore } from "../stores/auth-store";
export function useLoginMutation() {
  const client = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      useAuthStore.getState().setAccessToken(response.result.accessToken);
      void client.invalidateQueries({ queryKey: ["members", "me"] });
      void navigate({ to: "/" });
    },
  });
}
