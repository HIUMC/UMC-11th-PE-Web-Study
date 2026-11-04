import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "../pages/members/my-page";

export const Route = createFileRoute("/mypage")({
  // 로그인(7주차) 전까지는 회원 번호를 search param으로 받아요.
  validateSearch: (search): { memberId?: number } => {
    const memberId = Number(search.memberId);
    return {
      memberId:
        Number.isInteger(memberId) && memberId > 0 ? memberId : undefined,
    };
  },
  component: MyPage,
});
