"use client";
import Link from "next/link";

import type { ReactNode } from "react";
import { useAuthStore } from "../store/auth-store";

export function Outlet({ children }: { children: ReactNode }) { return <>{children}</>; }
export function AuthLayout({ children }: { children: ReactNode }) {
  const hydrated = useAuthStore(state => state.hydrated);
  const token = useAuthStore(state => state.token);
  if (!hydrated) return <p className="notice">인증 정보를 확인하고 있어요…</p>;
  if (!token) return <main className="profile-page"><p className="notice">로그인이 필요해요. <Link className="primary-button" href="/login">로그인</Link></p></main>;
  return <Outlet>{children}</Outlet>;
}
