import type { Metadata } from "next";
import { EditProfilePage } from "../../../screens/member/edit-profile-page";

export const metadata: Metadata = { title: "내 정보 수정" };
// 공통 AuthGuard가 저장된 토큰을 복원한 뒤 이 화면을 표시한다.
export const instant = false;

export default function Page() { return <EditProfilePage />; }
