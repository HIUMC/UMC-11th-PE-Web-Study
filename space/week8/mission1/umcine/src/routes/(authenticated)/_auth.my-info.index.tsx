import { createFileRoute } from "@tanstack/react-router";
import { MyInfoPage } from "../../pages/account/my-info-page";

export const Route = createFileRoute("/(authenticated)/_auth/my-info/")({
  component: MyInfoPage,
});
