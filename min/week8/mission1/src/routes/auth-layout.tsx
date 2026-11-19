import type { ReactNode } from "react";
import { useAuthStore } from "../store/auth-store";

export function Outlet({ children }: { children: ReactNode }) { return <>{children}</>; }
export function AuthLayout({ children }: { children: ReactNode }) {
  const token = useAuthStore(state => state.token);
  if (!token) return <main className="profile-page"><p className="notice">로그인이 필요해요. <a className="primary-button" href="/login">로그인</a></p></main>;
  return <Outlet>{children}</Outlet>;
}
