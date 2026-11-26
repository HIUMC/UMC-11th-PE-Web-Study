import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthGuard } from "../../components/auth/auth-guard";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function MemberLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
