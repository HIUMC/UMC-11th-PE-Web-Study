import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "../../pages/member/profile-page";

export const Route = createFileRoute("/(member)/mypage")({ component: ProfilePage });
