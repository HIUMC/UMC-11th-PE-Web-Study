import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "@/pages/members/my-page";

export const Route = createFileRoute("/(authenticated)/_auth/mypage/")({ component: MyPage });
