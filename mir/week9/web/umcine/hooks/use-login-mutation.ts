// hooks/use-login-mutation.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "../api/auth/login";
import { useAuthStore } from "../stores/auth-store";

export function useLoginMutation() {
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAccessToken(data.result.accessToken);
      router.push("/");
    },
    onError: () => {
      alert("이메일 또는 비밀번호를 확인해 주세요.");
    },
  });
}
