"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthReady } from "@/app/providers";
import { useCurrentMember } from "@/hooks/use-current-member";
import { useAuthStore } from "@/stores/auth-store";

export function AuthGate({ children, mode }: {
  children: ReactNode;
  mode: "authenticated" | "guest";
}) {
  const router = useRouter();
  const authReady = useAuthReady();
  const accessToken = useAuthStore((state) => state.accessToken);
  const checkGuestSession = mode === "guest" && authReady && Boolean(accessToken);
  const meQuery = useCurrentMember(checkGuestSession);

  const destination =
    mode === "authenticated" && !accessToken ? "/login" :
    checkGuestSession && meQuery.isSuccess ? "/" : null;

  useEffect(() => {
    if (authReady && destination) {
      router.replace(destination);
    }
  }, [authReady, destination, router]);

  if (!authReady || destination || (checkGuestSession && meQuery.isPending)) {
    return null;
  }

  return children;
}
