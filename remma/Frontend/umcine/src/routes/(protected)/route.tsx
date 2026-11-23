import { createFileRoute } from "@tanstack/react-router";
import { ProtectedLayout } from "../../components/layout/protected-layout";
import { requireAuth } from "../../utils/auth/require-auth";

export const Route = createFileRoute("/(protected)")({
  beforeLoad: requireAuth,
  component: ProtectedLayout,
});
