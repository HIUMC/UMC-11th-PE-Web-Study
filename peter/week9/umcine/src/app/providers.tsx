"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useBookmarkStore } from "@/stores/bookmark-store";
import { useAuthStore } from "@/stores/auth-store";
import { useMoviePreferenceStore } from "@/stores/movie-preference-store";

const AuthReadyContext = createContext(false);

export function useAuthReady() {
  return useContext(AuthReadyContext);
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  }));

  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    void Promise.resolve(useAuthStore.persist.rehydrate()).then(() => setAuthReady(true));
    void useBookmarkStore.persist.rehydrate();
    void useMoviePreferenceStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthReadyContext.Provider value={authReady}>
        {children}
      </AuthReadyContext.Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
