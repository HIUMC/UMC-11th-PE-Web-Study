import type { ReactNode } from "react";
import { AuthGate } from "@/components/layout/auth-gate";

export default function Layout({ children }: { children: ReactNode }) {
  return <AuthGate mode="authenticated">{children}</AuthGate>;
}
