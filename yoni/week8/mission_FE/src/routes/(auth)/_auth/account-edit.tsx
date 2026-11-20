import { createFileRoute } from "@tanstack/react-router";
import { AccountEditPage } from "../../../pages/account-edit-page";

export const Route = createFileRoute("/(auth)/_auth/account-edit")({
  component: AccountEditPage,
});
