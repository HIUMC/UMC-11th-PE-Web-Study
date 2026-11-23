import type { Metadata } from "next";
import { BackendTestPage } from "@/views/backend/backend-test-page";

export const metadata: Metadata = { title: "백엔드 API 테스트" };

export default function Page() {
  return <BackendTestPage />;
}
