import {
  createFileRoute,
  Outlet,
  redirect,
} from "@tanstack/react-router";

import { useAuthStore } from "@/stores/auth-store";

function MyPageLayout() {
  return <Outlet />;
}

export const Route = createFileRoute("/(private)/mypage")({
  beforeLoad: () => {
    const accessToken = useAuthStore.getState().accessToken;

    if (!accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: MyPageLayout,
});