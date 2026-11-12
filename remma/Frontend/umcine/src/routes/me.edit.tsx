import { createFileRoute } from "@tanstack/react-router";
import { MyInfoEditPage } from "../pages/members/my-info-edit-page";
import { requireAuth } from "../utils/auth/require-auth";

export const Route = createFileRoute("/me/edit")({
  beforeLoad: requireAuth,
  component: MyInfoEditPage,
});
