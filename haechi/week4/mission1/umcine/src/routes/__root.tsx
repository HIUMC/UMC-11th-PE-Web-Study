import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";
import { Footer } from "../components/layout/footer";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <p className="text-lg font-bold">페이지를 찾을 수 없어요.</p>
      <Link
        to="/"
        className="rounded-lg bg-ink px-4 py-2 text-sm font-bold text-surface"
      >
        영화 목록으로
      </Link>
    </main>
  ),
});

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
