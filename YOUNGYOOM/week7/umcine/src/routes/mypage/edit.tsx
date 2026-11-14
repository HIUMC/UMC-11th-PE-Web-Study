import { createFileRoute } from "@tanstack/react-router";
import { EditMyInfoPage } from "../../pages/mypage/edit-my-info-page";

export const Route = createFileRoute("/mypage/edit")({
  component: EditMyInfoPage,
});
