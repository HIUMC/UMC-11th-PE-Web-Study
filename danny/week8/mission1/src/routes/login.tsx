import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "../pages/auth/login-page";
import { parseRedirectParam } from "../utils/redirect-param";

export const Route = createFileRoute("/login")({
  validateSearch: (search): { redirect?: string } => ({
    redirect: parseRedirectParam(search.redirect),
  }),
  component: LoginPage,
});
