import { createFileRoute } from "@tanstack/react-router";
import { ProfileEditPage } from "../pages/member/profile-edit-page";

export const Route = createFileRoute("/mypage_/edit")({
  component: ProfileEditPage,
});