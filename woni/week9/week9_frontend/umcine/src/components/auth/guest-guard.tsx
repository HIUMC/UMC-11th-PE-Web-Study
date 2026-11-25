"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStoreHydrated } from "@/hooks/use-auth-store-hydrated";
import { useAuthStore } from "@/stores/auth-store";

interface GuestGuardProps {
  children: ReactNode;
}

// 이미 로그인한 상태면 홈으로 보냄 (기존 /login 라우트의 beforeLoad 대체)
export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const isHydrated = useAuthStoreHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (isHydrated && accessToken) {
      router.replace("/");
    }
  }, [isHydrated, accessToken, router]);

  // 복원 전이거나 이동할 예정이면 아무것도 그리지 않음
  if (!isHydrated || accessToken) return null;

  return children;
}
