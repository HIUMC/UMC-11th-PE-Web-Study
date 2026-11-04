import {
  createRootRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { Header } from "../components/layout/header";
import { Footer } from "../components/layout/footer";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const showFooter = useRouterState({
    select: (state) => {
      const { pathname, searchStr } = state.location;

      if (pathname === "/search") {
        const query = new URLSearchParams(searchStr).get("query");
        return Boolean(query?.trim());
      }

      return pathname === "/" || pathname.startsWith("/movies/");
    },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="flex-1 bg-[#f5f6f8]">
        <Outlet />
      </div>

      {showFooter && <Footer />}
    </div>
  );
}
