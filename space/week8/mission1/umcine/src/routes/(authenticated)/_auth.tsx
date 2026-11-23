import { createFileRoute } from "@tanstack/react-router";
import { AuthenticatedLayout } from "../../components/authenticated-layout";
import { requireAuth } from "../-auth-guard";
export const Route = createFileRoute("/(authenticated)/_auth")({ beforeLoad: requireAuth, component: AuthenticatedLayout });
