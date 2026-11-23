"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthStore } from "@/stores/auth-store";

// TanStack Router의 beforeLoad + redirect를 대신한다.
// 로그인이 필요한 페이지에서 토큰이 없으면 /login으로 보낸다.
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (hydrated && !accessToken) router.replace("/login");
  }, [hydrated, accessToken, router]);

  if (!hydrated || !accessToken) return null;
  return <>{children}</>;
}
