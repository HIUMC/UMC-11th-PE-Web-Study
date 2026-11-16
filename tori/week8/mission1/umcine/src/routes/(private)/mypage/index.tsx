import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "@/pages/auth/mypage-page";

export const Route = createFileRoute("/(private)/mypage/")({
  component: MyPage,
});