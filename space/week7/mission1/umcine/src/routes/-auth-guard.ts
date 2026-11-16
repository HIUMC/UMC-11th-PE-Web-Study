import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "../stores/auth-store";

export function requireAuth() {
  if (!useAuthStore.getState().accessToken) {
    throw redirect({ to: "/login" });
  }
}
