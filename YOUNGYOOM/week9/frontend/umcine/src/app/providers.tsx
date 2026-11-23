"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode, createContext, useEffect } from "react";
// 기존 React import에 createContext, useEffect 추가

import { useAuthStore } from "@/stores/auth-store";
import { useBookmarkStore } from "@/stores/bookmark-store";

export const AuthReadyContext = createContext(false);

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, gcTime: 30_000 },
        },
      }),
  );

  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    async function restoreAuth() {
      try {
        await useAuthStore.persist?.rehydrate();
      } finally {
        setAuthReady(true);
      }
    }

    void restoreAuth();
    void useBookmarkStore.persist?.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthReadyContext.Provider value={authReady}>
        {children}
      </AuthReadyContext.Provider>
    </QueryClientProvider>
  );
}
