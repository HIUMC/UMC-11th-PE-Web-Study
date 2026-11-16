import { createFileRoute } from "@tanstack/react-router";
import { MyPageEdit } from "../pages/members/my-page-edit";

// mypage_ 의 _ 는 /mypage 안에 겹치지 않고 별도 화면으로 보여준다는 뜻
export const Route = createFileRoute("/mypage_/edit")({
  component: MyPageEdit,
});
