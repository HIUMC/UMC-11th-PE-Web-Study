import { createRootRoute, Outlet } from "@tanstack/react-router";
import Header from "../components/layout/header";
import TmdbAttribution from "../components/layout/tmdb-attribution";

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <TmdbAttribution />
    </div>
  ),
  notFoundComponent: () => <main>페이지를 찾을 수 없어요.</main>,
});