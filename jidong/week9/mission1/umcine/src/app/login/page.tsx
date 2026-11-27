import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginPage } from "../../screens/auth/login-page";

export const metadata: Metadata = {
  title: "로그인",
  description: "UMCine에 로그인해요.",
};

export default function Page() {
  return (
    <Suspense
      fallback={<p className="p-16 text-center text-sm text-gray-500">로그인 화면을 불러오는 중이에요.</p>}
    >
      <LoginPage />
    </Suspense>
  );
}
