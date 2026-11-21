import { createFileRoute } from "@tanstack/react-router";
import { MyEditPage } from "@/pages/members/my-edit-page";

export const Route = createFileRoute("/(authenticated)/_auth/me_/edit")({
  component: MyEditPage,
});