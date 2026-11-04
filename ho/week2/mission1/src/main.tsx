import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { routeTree } from "./routeTree.gen";
import "./index.css";

// /?example=fetch에서만 순수 fetch 실습을 실행해 Network/Console로 확인해요.
if (
  import.meta.env.DEV &&
  new URLSearchParams(window.location.search).get("example") === "fetch"
) {
  void import("./examples/fetch-movies");
}

const router = createRouter({ routeTree });
const ONE_MINUTE = 60 * 1000;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: ONE_MINUTE },
  },
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
