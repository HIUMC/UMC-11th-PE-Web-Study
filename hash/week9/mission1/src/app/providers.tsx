"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getQueryClient } from "../config/query-client";
import { useAuthStore } from "../stores/auth-store";
import { useBookmarkStore } from "../stores/bookmark-store";
import { useUiSettingsStore } from "../stores/ui-settings-store";

const AuthReadyContext = createContext(false);

export function useAuthReady() {
  return useContext(AuthReadyContext);
}

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let active = true;
    void Promise.resolve(useAuthStore.persist.rehydrate()).finally(() => {
      if (active) setAuthReady(true);
    });
    void useBookmarkStore.persist.rehydrate();
    void useUiSettingsStore.persist.rehydrate();
    return () => { active = false; };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthReadyContext.Provider value={authReady}>{children}</AuthReadyContext.Provider>
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
