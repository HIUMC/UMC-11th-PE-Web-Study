import { createRootRoute, Outlet } from "@tanstack/react-router";
import Header from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-gray-100 py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-2 px-6 text-xs text-gray-400 lg:px-8">
          <img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="h-3 w-auto" />
          <span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
        </div>
      </footer>
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <p className="text-lg font-bold text-gray-800">페이지를 찾을 수 없어요.</p>
    </div>
  ),
});