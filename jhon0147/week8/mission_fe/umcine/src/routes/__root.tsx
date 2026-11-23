import { createRootRoute } from "@tanstack/react-router";
import { RootLayout } from "../components/layout/root-layout";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => (
    <main className="grid flex-1 place-items-center px-6 py-24 text-center">
      <div>
        <p className="text-sm font-bold text-blue-600">404</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
          페이지를 찾을 수 없어요.
        </h1>
      </div>
    </main>
  ),
});
