import { createFileRoute } from "@tanstack/react-router";
import MyInfoPage from "../pages/member/my-info-page";

export const Route = createFileRoute("/my")({
  component: MyInfoPage,
});
