import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "../pages/members/my-page";
import { requireAuth } from "../utils/auth/require-auth";

export const Route = createFileRoute("/me/")({
  beforeLoad: requireAuth,
  component: MyPage,
});
