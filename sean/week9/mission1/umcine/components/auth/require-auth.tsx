"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthHydrated, useAuthStore } from "@/stores/auth-store";

/**
 * TanStack Router의 `_authenticated` Layout Route + beforeLoad를 대신합니다.
 *
 * 토큰이 localStorage에 있어 서버는 로그인 여부를 알 수 없습니다.
 * 그래서 서버에서 막지 못하고, 브라우저에서 토큰을 읽은 뒤에 판단합니다.
 * hydration이 끝나기 전에 판단하면 로그인한 사용자도 튕겨 나가므로 기다립니다.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (hydrated && !accessToken) {
      router.replace("/login");
    }
  }, [hydrated, accessToken, router]);

  if (!hydrated || !accessToken) {
    return (
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-[#f5f6f8]">
        <p className="text-neutral-500">불러오는 중이에요.</p>
      </main>
    );
  }

  return <>{children}</>;
}
