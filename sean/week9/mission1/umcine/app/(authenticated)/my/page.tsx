import type { Metadata } from "next";
import { MyPageContent } from "@/components/members/my-page-content";

export const metadata: Metadata = {
  title: "내 정보",
  description: "내 계정 정보와 즐겨찾기한 영화를 확인해요.",
};

export default function MyPage() {
  return <MyPageContent />;
}
