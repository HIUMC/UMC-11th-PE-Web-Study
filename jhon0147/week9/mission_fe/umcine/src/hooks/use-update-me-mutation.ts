import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMeOptions } from "../mutations/account-mutations";
import { accountKeys } from "../queries/account-queries";
import { useAuthStore } from "../stores/auth-store";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore(state => state.accessToken);
  return useMutation({
    ...updateMeOptions,
    onSuccess: async (memberInfo) => {
      await queryClient.cancelQueries({ queryKey: accountKeys.me });
      if (accessToken !== useAuthStore.getState().accessToken) return;
      queryClient.setQueryData(accountKeys.me, memberInfo);
    },
  });
}
