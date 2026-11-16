import { redirect, type ParsedLocation } from "@tanstack/react-router";
import { isAuthenticated } from "../../stores/auth-store";

/**
 * 로그인이 필요한 라우트의 beforeLoad에서 사용해요.
 * 로그인하지 않았다면 로그인 페이지로 보내고, 로그인 후 원래 페이지로 돌아오게 해요.
 */
export function requireAuth({ location }: { location: ParsedLocation }) {
  if (!isAuthenticated()) {
    throw redirect({
      to: "/login",
      search: { redirect: location.href },
    });
  }
}
