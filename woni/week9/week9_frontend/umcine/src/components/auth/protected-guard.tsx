"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStoreHydrated } from "@/hooks/use-auth-store-hydrated";
import { useAuthStore } from "@/stores/auth-store";

interface ProtectedGuardProps {
  children: ReactNode;
}

// 로그인 후에만 접근할 수 있는 페이지를 감싸는 가드
// 토큰이 localStorage에 있어 서버에서는 검사할 수 없으므로 브라우저에서 검사
export function ProtectedGuard({ children }: ProtectedGuardProps) {
  const router = useRouter();
  const isHydrated = useAuthStoreHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (isHydrated && !accessToken) {
      router.replace("/login");
    }
  }, [isHydrated, accessToken, router]);

  // 복원 전이거나 이동할 예정이면 아무것도 그리지 않음
  if (!isHydrated || !accessToken) return null;

  return children;
}
