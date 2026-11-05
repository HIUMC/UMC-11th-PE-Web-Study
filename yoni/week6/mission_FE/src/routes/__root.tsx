import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <footer className="border-t border-gray-200 px-6 py-6 text-center">
        <img
          src="/umcine-images/images/logos/tmdb-logo.svg"
          alt="TMDB"
          className="mx-auto h-5 w-auto"
        />
        <p className="mt-3 text-xs text-gray-500">
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>
      </footer>
    </>
  ),
  notFoundComponent: () => <main>페이지를 찾을 수 없어요.</main>,
});
