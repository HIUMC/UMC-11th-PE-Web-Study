"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth-store";
import { useBookmarkStore } from "../stores/bookmark-store";

const HydratedContext = createContext(false);
export const useAuthHydrated = () => useContext(HydratedContext);

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000 } },
  }));
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe((state, previous) => {
      if (state.accessToken === previous.accessToken) return;
      for (const key of ["members", "favorites", "ratings"]) {
        void client.cancelQueries({ queryKey: [key] });
        client.removeQueries({ queryKey: [key] });
      }
    });
    let active = true;
    void Promise.all([
      useAuthStore.persist.rehydrate(), useBookmarkStore.persist.rehydrate(),
    ]).finally(() => { if (active) setHydrated(true); });
    return () => { active = false; unsubscribe(); };
  }, [client]);
  return <QueryClientProvider client={client}><HydratedContext value={hydrated}>{children}</HydratedContext></QueryClientProvider>;
}
