import { createRootRoute, Outlet } from "@tanstack/react-router";
import Header from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
    </>
  ),
  notFoundComponent: () => (
    <main className="mx-auto max-w-[1200px] px-6 py-16">
      <p className="text-[#a0a0a0]">페이지를 찾을 수 없어요.</p>
    </main>
  ),
});
