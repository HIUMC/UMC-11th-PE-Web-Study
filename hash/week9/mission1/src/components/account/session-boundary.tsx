"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../stores/auth-store";
import { useAuthReady } from "../../app/providers";
import RequestMessage from "../movies/request-message";

export default function SessionBoundary({
  requireAuth,
  children,
}: {
  requireAuth: boolean;
  children: ReactNode;
}) {
  const router = useRouter();
  const ready = useAuthReady();
  const accessToken = useAuthStore((state) => state.accessToken);
  const sessionId = useAuthStore((state) => state.sessionId);
  const allowed = Boolean(accessToken) === requireAuth;

  useEffect(() => {
    if (ready && !allowed) router.replace(requireAuth ? "/login" : "/");
  }, [ready, allowed, requireAuth, router]);

  if (!ready || !allowed) {
    return <main className="flex-1"><RequestMessage message="로그인 상태를 확인하고 있어요." /></main>;
  }

  return <div key={sessionId} className="flex flex-1 flex-col">{children}</div>;
}
