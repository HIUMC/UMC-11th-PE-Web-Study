import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

// (auth)는 Route Group이라 주소에는 안 붙고, 로그인 후에만 볼 페이지를 한 폴더로 묶는 용도임
// 이 route.tsx가 그룹 공통 Layout Route가 돼서 토큰 검사를 한 곳에서 처리함
export const Route = createFileRoute("/(auth)")({
  beforeLoad: ({ location }) => {
    if (!useAuthStore.getState().accessToken) {
      // 로그인 후 원래 보려던 페이지로 돌아올 수 있게 주소를 같이 넘김
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  component: () => <Outlet />,
});
