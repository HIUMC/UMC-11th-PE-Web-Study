import { createFileRoute } from "@tanstack/react-router";
import { EditMyInfoPage } from "../../pages/account/edit-my-info-page";

export const Route = createFileRoute("/(authenticated)/_auth/my-info/edit")({
  component: EditMyInfoPage,
});
