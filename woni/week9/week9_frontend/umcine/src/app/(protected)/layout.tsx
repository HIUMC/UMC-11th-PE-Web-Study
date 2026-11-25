import type { ReactNode } from "react";
import { ProtectedGuard } from "@/components/auth/protected-guard";

// 로그인 후에만 접근할 수 있는 페이지를 묶는 Route Group
// (protected) 폴더 이름은 URL에 포함되지 않음
interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return <ProtectedGuard>{children}</ProtectedGuard>;
}
