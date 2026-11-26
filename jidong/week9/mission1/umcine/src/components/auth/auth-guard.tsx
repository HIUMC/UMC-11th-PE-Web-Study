"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthHydrated } from "../../hooks/use-auth-hydrated";
import { useAuthStore } from "../../stores/auth-store";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (hydrated && !useAuthStore.getState().accessToken) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, pathname, router]);

  if (!hydrated) {
    return (
      <p aria-busy="true" className="p-16 text-center text-sm text-gray-500">
        로그인 상태를 확인하는 중이에요.
      </p>
    );
  }

  if (!accessToken) {
    return (
      <p className="p-16 text-center text-sm text-gray-500">
        로그인이 필요해요.{" "}
        <Link
          href={`/login?redirect=${encodeURIComponent(pathname)}`}
          className="font-bold text-blue-600"
        >
          로그인하기
        </Link>
      </p>
    );
  }

  return children;
}
