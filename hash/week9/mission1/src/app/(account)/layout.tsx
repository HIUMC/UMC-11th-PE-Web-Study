import type { ReactNode } from "react";
import SessionBoundary from "../../components/account/session-boundary";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <SessionBoundary requireAuth>{children}</SessionBoundary>;
}
