"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

const ONE_MINUTE = 60 * 1000;

/**
 * main.tsx에서 하던 QueryClientProvider 설정을 Client Component로 옮긴 것입니다.
 * QueryClient를 useState 안에서 만드는 이유는, 서버에서 만든 인스턴스가
 * 여러 요청에 공유되지 않도록 하기 위해서입니다.
 */
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: ONE_MINUTE } },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
