import { createRootRoute } from "@tanstack/react-router";
import App from "../App";

export const Route = createRootRoute({
  component: App,
  notFoundComponent: () => (
    <main className="main">페이지를 찾을 수 없어요.</main>
  ),
});