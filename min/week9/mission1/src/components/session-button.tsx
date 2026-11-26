"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth-store";

export function SessionButton() {
 const router = useRouter();
  const token = useAuthStore(state => state.token);
  const logout = useAuthStore(state => state.logout);
  const client = useQueryClient();
  if (!token) return <Link className="login" href="/login">로그인</Link>;
  return <button className="login" type="button" onClick={() => { logout(); client.clear(); router.push("/login"); }}>로그아웃</button>;
}
