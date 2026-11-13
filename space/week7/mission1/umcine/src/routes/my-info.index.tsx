import { createFileRoute } from "@tanstack/react-router";
import { MyInfoPage } from "../pages/account/my-info-page";

export const Route = createFileRoute("/my-info/")({
  component: MyInfoPage,
});
