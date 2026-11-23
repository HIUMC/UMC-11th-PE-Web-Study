import { createFileRoute } from "@tanstack/react-router";
import { MyInfoEditPage } from "../../pages/members/my-info-edit-page";

export const Route = createFileRoute("/(protected)/me/edit")({
  component: MyInfoEditPage,
});
