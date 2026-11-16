import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "../pages/auth/login-page";
import { isAuthenticated } from "../stores/auth-store";

export const Route = createFileRoute("/login")({
  validateSearch: (search): { redirect?: string } => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  // 이미 로그인한 상태라면 내 정보 페이지로 보내요.
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: "/me" });
    }
  },
  component: LoginPage,
});
