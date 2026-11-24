import type { ReactNode } from "react";
import { AuthGuard } from "@/components/layout/authenticated-layout";
export default function Layout({ children }: { children: ReactNode }) { return <AuthGuard>{children}</AuthGuard>; }
