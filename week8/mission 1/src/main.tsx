import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { routeTree } from "./routeTree.gen";
import { useAuthStore } from "./stores/auth-store";
import "./index.css";

const router = createRouter({ routeTree });
const ONE_MINUTE = 30 * 1000;
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: ONE_MINUTE } }, // staleTime: 60 * 1000도 가능
});

// 계정 변경이나 토큰 만료 시 이전 회원의 응답과 캐시가 남지 않게 합니다.
const unsubscribeAuth = useAuthStore.subscribe((state, previous) => {
  if (state.accessToken === previous.accessToken) return;
  const filters = {
    predicate: (query: { queryKey: readonly unknown[] }) =>
      query.queryKey[0] === "members" || query.queryKey[0] === "ratings" || query.queryKey[0] === "favorites",
  };
  void queryClient.cancelQueries(filters);
  queryClient.removeQueries(filters);
  void router.invalidate();
});
if (import.meta.hot) import.meta.hot.dispose(unsubscribeAuth);

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
