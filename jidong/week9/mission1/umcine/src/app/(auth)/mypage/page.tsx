import type { Metadata } from "next";
import { MyPage } from "../../../screens/members/my-page";

export const metadata: Metadata = {
  title: "마이페이지",
  description: "내 정보와 즐겨찾기한 영화, 내가 남긴 평점을 확인해요.",
};

export default function Page() {
  return <MyPage />;
}
