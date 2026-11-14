import { createFileRoute } from "@tanstack/react-router";
import { MyInfoPage } from "../../pages/mypage/my-info-page";

export const Route = createFileRoute("/mypage/")({
  component: MyInfoPage,
});
