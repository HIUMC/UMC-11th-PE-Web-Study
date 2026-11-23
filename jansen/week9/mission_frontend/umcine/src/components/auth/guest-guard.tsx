"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthStore } from "@/stores/auth-store";

// 이미 로그인한 사용자가 로그인 페이지에 들어오면 홈으로 보낸다.
export function GuestGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (hydrated && accessToken) router.replace("/");
  }, [hydrated, accessToken, router]);

  if (!hydrated || accessToken) return null;
  return <>{children}</>;
}
