"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "../api/auth/login";
import { useAuthStore } from "../stores/auth-store";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const setAccessToken = useAuthStore(
    (state) => state.setAccessToken,
  );

  return useMutation({
    mutationFn: login,
    onSuccess: async (response) => {
      setAccessToken(response.result.accessToken);

      await queryClient.invalidateQueries({
        queryKey: ["members", "me"],
      });

      alert("로그인에 성공했어요.");
      router.replace("/");
    },
    onError: () => {
      alert("로그인에 실패했어요. 다시 시도해 주세요.");
    },
  });
}