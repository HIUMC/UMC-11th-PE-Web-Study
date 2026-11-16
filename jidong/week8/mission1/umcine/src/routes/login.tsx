import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "../pages/auth/login-page";
import { useAuthStore } from "../stores/auth-store";

export const Route = createFileRoute("/login")({
  // 로그인 후 돌아갈 주소. 다른 사이트로 튕기지 않게 우리 사이트 경로(/로 시작)만 받음
  validateSearch: (search): { redirect?: string } => ({
    redirect:
      typeof search.redirect === "string" &&
      search.redirect.startsWith("/") &&
      !search.redirect.startsWith("//")
        ? search.redirect
        : undefined,
  }),
  // 이미 로그인한 사람이 /login을 직접 열면 페이지를 보여 주기 전에 홈으로 보냄
  beforeLoad: () => {
    if (useAuthStore.getState().accessToken) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});
