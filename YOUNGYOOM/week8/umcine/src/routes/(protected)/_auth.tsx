//routes/(protected)/_auth/_auth.tsx
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

export const Route = createFileRoute("/(protected)/_auth")({
  beforeLoad: () => {
    // 마이페이지나 수정 페이지를 열기 전에 저장된 토큰을 확인
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  // 접근이 허용되면 현재 주소에 맞는 하위 페이지를 렌더링
  component: Outlet,
});
