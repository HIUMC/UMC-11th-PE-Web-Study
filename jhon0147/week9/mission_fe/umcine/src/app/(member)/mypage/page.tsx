import type { Metadata } from "next";
import { ProfilePage } from "../../../screens/member/profile-page";

export const metadata: Metadata = { title: "내 정보" };
// 브라우저의 토큰 복원을 기다리는 페이지이므로 즉시 이동 검증에서 제외한다.
export const instant = false;

export default function Page() { return <ProfilePage />; }
