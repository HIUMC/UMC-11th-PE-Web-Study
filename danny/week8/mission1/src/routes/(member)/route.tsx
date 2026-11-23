import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getValidAccessToken } from "../../stores/auth-store";

export const Route = createFileRoute("/(member)")({
  beforeLoad: ({ location }) => {
    if (!getValidAccessToken()) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  component: MemberLayout,
});

function MemberLayout() {
  return <Outlet />;
}
