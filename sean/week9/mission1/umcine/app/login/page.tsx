import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "로그인",
  description: "UMCine에 로그인하고 평점과 즐겨찾기를 남겨보세요.",
};

// 페이지 자체는 Server Component로 두고, 입력과 상호작용이 필요한 폼만 Client Component입니다.
// 덕분에 이 파일에서 metadata를 export할 수 있습니다.
export default function LoginPage() {
  return <LoginForm />;
}
