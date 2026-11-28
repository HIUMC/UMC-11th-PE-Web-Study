"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../stores/auth-store";
import { useHydrated } from "../../hooks/use-hydrated";

export function AuthGuard({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const hydrated = useHydrated();

  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  useEffect(() => {
    if (hydrated && !accessToken) {
      router.replace("/login");
    }
  }, [hydrated, accessToken, router]);

  if (!hydrated || !accessToken) {
    return (
      <main className="page-container py-24 text-center text-gray-500">
        로그인 상태를 확인하는 중이에요.
      </main>
    );
  }

  return <>{children}</>;
}