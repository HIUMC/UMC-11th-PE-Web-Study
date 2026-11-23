import { createFileRoute } from "@tanstack/react-router";
import { ProfileEditPage } from "../../pages/member/profile-edit-page";

export const Route = createFileRoute(
  "/(protected)/_auth/mypage_/edit",
)({
  component: ProfileEditPage,
});