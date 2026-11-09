import { createRootRoute, Outlet } from "@tanstack/react-router";
import Footer from "../components/footer";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col bg-[#f5f6f8] text-[#17191d]">
      <Header />
      <Outlet />
      <Footer />
    </div>
  ),
  notFoundComponent: () => (
    <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-8 text-lg font-semibold">
      페이지를 찾을 수 없어요.
    </main>
  ),
});
