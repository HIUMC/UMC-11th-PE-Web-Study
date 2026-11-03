import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//QueryClient : 캐시와 요청 설정을 관리하는 객체
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { routeTree } from "./routeTree.gen";
import "./index.css";
import "./examples/fetch-movies";

const router = createRouter({ routeTree });

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30 * 1000, gcTime: 30 * 1000 } },
  // staleTime: 60 * 1000도 가능
});

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
