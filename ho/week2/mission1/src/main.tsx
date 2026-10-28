import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import "./index.css";

// /?example=fetch에서만 순수 fetch 실습을 실행해 Network/Console로 확인해요.
if (import.meta.env.DEV && new URLSearchParams(window.location.search).get("example") === "fetch") {
  void import("./examples/fetch-movies");
}

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
