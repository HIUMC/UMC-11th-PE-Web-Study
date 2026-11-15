import { createFileRoute } from "@tanstack/react-router";
import { MyPageEdit } from "@/pages/auth/mypage-edit-page";

export const Route = createFileRoute("/(private)/mypage/edit")({
  component: MyPageEdit,
});