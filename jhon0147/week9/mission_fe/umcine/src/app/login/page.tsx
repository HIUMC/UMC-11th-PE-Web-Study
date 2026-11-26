import type { Metadata } from "next";
import { AuthGuard } from "../../components/auth/auth-guard";
import { LoginPage } from "../../screens/auth/login-page";

export const metadata: Metadata = { title: "로그인" };

export default function Page() {
  return <AuthGuard guestOnly><LoginPage /></AuthGuard>;
}
