"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../stores/auth-store";
import { RequestState } from "../movies/request-state";

export function AuthGuard({ children, guestOnly = false }: { children: ReactNode; guestOnly?: boolean }) {
  const router = useRouter();
  const accessToken = useAuthStore(state => state.accessToken);
  const hasHydrated = useAuthStore(state => state.hasHydrated);
  const shouldRedirect = hasHydrated && (guestOnly ? Boolean(accessToken) : !accessToken);

  useEffect(() => {
    if (shouldRedirect) router.replace(guestOnly ? "/" : "/login");
  }, [guestOnly, router, shouldRedirect]);

  if (!hasHydrated || shouldRedirect) {
    return <main className="flex-1 px-5 py-14"><RequestState loading message="로그인 상태를 확인하는 중..." /></main>;
  }
  return children;
}
