import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Footer } from "../components/layout/footer";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-page text-ink">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <TanStackRouterDevtools />
    </div>
  );
}
