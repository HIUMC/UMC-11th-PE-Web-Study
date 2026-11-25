import { MyEditPage } from "@/screens/members/my-edit-page";

// 보호 가드가 토큰 복원 전에는 이 페이지를 그리지 않으므로(서버 렌더에서 세그먼트가 빠짐)
// 의도된 동작으로 보고 instant navigation 검증(개발 모드)에서 제외
export const instant = false;

export default function MyEdit() {
  return <MyEditPage />;
}
