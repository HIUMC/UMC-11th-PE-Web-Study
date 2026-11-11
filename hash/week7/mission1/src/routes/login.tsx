import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "../pages/account/login-page";

export const Route = createFileRoute("/login")({ component: LoginPage });
