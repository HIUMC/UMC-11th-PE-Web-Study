"use client";

import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthStore } from "@/stores/auth-store";
import { useBookmarkStore } from "@/stores/bookmark-store";
import { useViewSettingStore } from "@/stores/view-setting-store";

const ONE_MINUTE = 60 * 1000;

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // 컴포넌트마다 QueryClient를 따로 만들어 요청(사용자) 사이에 캐시가 공유되지 않게 함
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: ONE_MINUTE } },
      }),
  );

  // persist 스토어는 skipHydration으로 서버와 같은 기본 상태로 시작하고,
  // 브라우저에 마운트된 뒤 localStorage 값으로 복원
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
    void useBookmarkStore.persist.rehydrate();
    void useViewSettingStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
