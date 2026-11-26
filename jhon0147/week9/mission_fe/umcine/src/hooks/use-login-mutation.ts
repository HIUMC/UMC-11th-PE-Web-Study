import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginOptions } from "../mutations/account-mutations";
import { accountKeys } from "../queries/account-queries";
import { useAuthStore } from "../stores/auth-store";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    ...loginOptions,
    onSuccess: async (response) => {
      useAuthStore.getState().setAccessToken(response.accessToken);
      await queryClient.invalidateQueries({ queryKey: accountKeys.me });
      router.replace("/");
    },
  });
}
