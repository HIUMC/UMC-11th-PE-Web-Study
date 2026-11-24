"use client";

import { useContext, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { AuthReadyContext } from "./providers";

export function AuthGate({
  children,
  guestOnly = false,
}: {
  children: ReactNode;
  guestOnly?: boolean;
}) {
  const router = useRouter();
  const authReady = useContext(AuthReadyContext);
  const accessToken = useAuthStore((state) => state.accessToken);

  const destination = guestOnly
    ? accessToken
      ? "/?page=1"
      : null
    : accessToken
      ? null
      : "/login";

  useEffect(() => {
    if (authReady && destination) router.replace(destination);
  }, [authReady, destination, router]);

  if (!authReady || destination) return <p>로그인 상태를 확인 중이에요.</p>;

  return children;
}
