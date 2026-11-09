import { createRootRoute, Outlet } from "@tanstack/react-router";
import {Header} from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
    </>
  ),
});
