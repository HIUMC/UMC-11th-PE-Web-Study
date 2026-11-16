import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { routeTree } from "./routeTree.gen";
import "./index.css";
import { useAuthStore } from "./stores/auth-store";

const router = createRouter({ routeTree });
const ONE_MINUTE = 30 * 1000;
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: ONE_MINUTE } }, // staleTime: 60 * 1000도 가능
});

useAuthStore.subscribe((state, previous) => {
  if (state.accessToken !== previous.accessToken) {
    queryClient.removeQueries({ queryKey: ["member"] });
    void router.invalidate();
  }
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