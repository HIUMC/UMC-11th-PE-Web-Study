import { createRootRoute, Outlet } from "@tanstack/react-router";
import Header from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <footer className="mt-20 border-t border-line bg-white px-20 py-6 text-right text-sm text-muted">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </>
  ),
  notFoundComponent: () => <main className="px-20 py-10">페이지를 찾을 수 없어요.</main>,
});