import { createFileRoute } from "@tanstack/react-router";
import { EditMyInfoPage } from "../pages/account/edit-my-info-page";
import { requireAuth } from "./-auth-guard";

export const Route = createFileRoute("/my-info/edit")({
  beforeLoad: requireAuth,
  component: EditMyInfoPage,
});
