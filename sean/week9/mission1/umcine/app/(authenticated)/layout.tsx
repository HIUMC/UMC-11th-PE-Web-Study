import type { ReactNode } from "react";
import { RequireAuth } from "@/components/auth/require-auth";

/**
 * 괄호 폴더 `(authenticated)`는 URL에 나타나지 않습니다.
 * `/my`, `/my/edit` 주소는 그대로이면서 이 레이아웃을 공통 부모로 갖습니다.
 * TanStack Router의 `_authenticated` Layout Route와 같은 역할입니다.
 */
export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}
