import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "@/pages/auth/login-page";
import { useAuthStore } from "@/stores/auth-store";

export const Route = createFileRoute("/login")({
  // 이미 로그인한 상태면 홈으로 보냄
  beforeLoad: () => {
    if (useAuthStore.getState().accessToken) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});
