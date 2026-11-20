import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col bg-[#F6F7F9] text-[#191c21]">
      <Header />
      <Outlet />
      <footer className="mt-auto flex min-h-11 flex-wrap items-center justify-center gap-2 border-t border-gray-200 bg-white px-5 py-3 text-center sm:justify-end xl:px-[max(80px,calc((100vw-1280px)/2))]">
        <img
          src="/umcine-images/images/logos/tmdb-logo.svg"
          alt="TMDB"
          className="h-2.5 w-auto"
        />
        <p className="text-[10px] text-gray-500">
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>
      </footer>
    </div>
  ),
  notFoundComponent: () => <main>페이지를 찾을 수 없어요.</main>,
});
