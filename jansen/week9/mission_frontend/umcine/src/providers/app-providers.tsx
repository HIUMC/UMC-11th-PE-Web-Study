"use client";

import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthStore } from "@/stores/auth-store";
import { useBookmarkStore } from "@/stores/bookmark-store";

const ONE_MINUTE = 60 * 1000;

export function AppProviders({ children }: { children: ReactNode }) {
  // 요청마다 QueryClient가 섞이지 않도록 컴포넌트 안에서 한 번만 만든다
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: ONE_MINUTE } },
      }),
  );

  // localStorage는 브라우저에만 있으므로, 화면이 뜬 뒤에 저장된 값을 복원한다
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
    void useBookmarkStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
