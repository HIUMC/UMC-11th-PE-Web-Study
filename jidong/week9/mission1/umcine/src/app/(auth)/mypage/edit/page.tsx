import type { Metadata } from "next";
import { MyPageEdit } from "../../../../screens/members/my-page-edit";

export const metadata: Metadata = {
  title: "내 정보 수정",
  description: "닉네임을 수정해요.",
};

export default function Page() {
  return <MyPageEdit />;
}
