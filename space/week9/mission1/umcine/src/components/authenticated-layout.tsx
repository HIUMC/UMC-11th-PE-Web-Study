"use client";
import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/auth-store";
import { useAuthHydrated } from "../app/providers";

export function AuthenticatedLayout({ children, guestOnly = false }: { children: ReactNode; guestOnly?: boolean }) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const token = useAuthStore((state) => state.accessToken);
  const allowed = guestOnly ? !token : Boolean(token);
  useEffect(() => {
    if (hydrated && !allowed) router.replace(guestOnly ? "/" : "/login");
  }, [hydrated, allowed, guestOnly, router]);
  if (!hydrated || !allowed) return <main className="p-6" role="status">로그인 상태를 확인하고 있어요.</main>;
  return children;
}
