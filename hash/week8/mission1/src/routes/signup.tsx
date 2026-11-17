import { createFileRoute } from "@tanstack/react-router";
import { SignupPage } from "../pages/account/signup-page";

export const Route = createFileRoute("/signup")({ component: SignupPage });
