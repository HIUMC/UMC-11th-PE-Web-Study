import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { routeTree } from "./routeTree.gen";
import { queryClient } from "./lib/query-client";
import { clearPrivateQueries } from "./lib/auth-session";
import { useAuthStore } from "./stores/auth-store";

const router = createRouter({ routeTree });

useAuthStore.subscribe((state, previous) => {
  if (state.accessToken === previous.accessToken) return;
  void clearPrivateQueries(queryClient);
  void router.invalidate();
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
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>,
);
