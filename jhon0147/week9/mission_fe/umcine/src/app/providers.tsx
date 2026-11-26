"use client";

import { useEffect, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "../lib/query-client";
import { clearPrivateQueries } from "../lib/auth-session";
import { useAuthStore } from "../stores/auth-store";

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe((state, previous) => {
      if (state.accessToken !== previous.accessToken) void clearPrivateQueries(queryClient);
    });
    // 서버와 브라우저의 첫 화면을 맞춘 뒤 저장된 토큰을 복원한다.
    const finish = () => useAuthStore.getState().finishHydration();
    void Promise.resolve(useAuthStore.persist.rehydrate()).then(finish, finish);
    return unsubscribe;
  }, [queryClient]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
