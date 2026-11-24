"use client";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
const subscribeHydration = (notify: () => void) => useAuthStore.persist.onFinishHydration(notify);
const getHydrated = () => useAuthStore.persist.hasHydrated();
const getServerHydrated = () => false;
export function AuthGuard({ children, guestOnly = false }: { children: ReactNode; guestOnly?: boolean }) {
 const hydrated = useSyncExternalStore(subscribeHydration, getHydrated, getServerHydrated);
 const accessToken = useAuthStore(state => state.accessToken);
 const router = useRouter(); const allowed = guestOnly ? !accessToken : Boolean(accessToken);
 useEffect(() => { if (hydrated && !allowed) router.replace(guestOnly ? "/" : "/login"); }, [hydrated, allowed, guestOnly, router]);
 if (!hydrated || !allowed) return <main className="mx-auto flex-1 p-16" role="status">로그인 정보를 확인하고 있어요.</main>;
 return children;
}
