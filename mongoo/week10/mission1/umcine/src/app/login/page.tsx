"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginPage } from "../../screens/auth/login-page";
import { useAuthStore } from "../../stores/auth-store";
import { useHydrated } from "../../hooks/use-hydrated";

export default function Page() {
  const router = useRouter();
  const hydrated = useHydrated();

  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  useEffect(() => {
    if (hydrated && accessToken) {
      router.replace("/");
    }
  }, [hydrated, accessToken, router]);

  if (!hydrated || accessToken) {
    return (
      <main className="page-container py-24 text-center text-gray-500">
        로그인 상태를 확인하는 중이에요.
      </main>
    );
  }

  return <LoginPage />;
}