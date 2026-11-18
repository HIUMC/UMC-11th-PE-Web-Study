import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";
import { AuthLayout } from "../../components/layout/auth-layout";

export const Route = createFileRoute("/(member)/_auth")({
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) throw redirect({ to: "/login" });
  },
  component: AuthLayout,
});
