import type { Metadata } from "next";
import { MyEditContent } from "@/components/members/my-edit-content";

export const metadata: Metadata = {
  title: "내 정보 수정",
  description: "닉네임과 프로필 이미지를 변경해요.",
};

export default function MyEditPage() {
  return <MyEditContent />;
}
