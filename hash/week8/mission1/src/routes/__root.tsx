import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import Footer from "../components/layout/footer";
import Header from "../components/layout/header";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
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

function NotFoundPage() {
  return (
    <main className="flex-1 px-6 py-20 text-center">
      <h1 className="mb-6 text-2xl font-bold">
        페이지를 찾을 수 없어요.
      </h1>

      <Link
        to="/"
        className="font-semibold text-[#4765df] hover:underline"
      >
        영화 목록으로 돌아가기
      </Link>
    </main>
  );
}