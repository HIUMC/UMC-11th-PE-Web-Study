import { createFileRoute } from "@tanstack/react-router";
import { BackendTestPage } from "../pages/backend/backend-test-page";

export const Route = createFileRoute("/backend-test")({
  component: BackendTestPage,
});