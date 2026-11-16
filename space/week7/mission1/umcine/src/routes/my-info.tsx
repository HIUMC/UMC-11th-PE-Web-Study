import { createFileRoute } from "@tanstack/react-router";
import { AuthenticatedLayout } from "../components/authenticated-layout";
import { requireAuth } from "./-auth-guard";

export const Route = createFileRoute("/my-info")({
  beforeLoad: requireAuth,
  component: AuthenticatedLayout,
});
