"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "../api/auth/login";
import { useAuthStore } from "../stores/auth-store";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: login,
    retry: false,
    onSuccess: (response) => {
      setAccessToken(response.result.accessToken);
      void queryClient.invalidateQueries({ queryKey: ["members", "me"] });
      router.replace("/");
    },
  });
}
