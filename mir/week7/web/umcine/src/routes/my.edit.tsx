import { createFileRoute } from "@tanstack/react-router";
import { MyEditPage } from "../pages/auth/my-edit-page";

export const Route = createFileRoute("/my/edit")({
  component: MyEditPage,
});
