"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { postJson, setAccessToken } from "../lib/client-auth";

interface LoginResponse { result: { accessToken: string }; }

export default function LoginPage() {
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const response = await postJson<LoginResponse>("auth/login", { email: form.get("email"), password: form.get("password") });
      setAccessToken(response.result.accessToken);
      window.location.assign("/");
    } catch { setError("로그인에 실패했습니다. 다시 시도해 주세요."); }
  }
  return <main className="mx-auto flex min-h-[calc(100vh-76px)] w-[min(440px,calc(100%-48px))] items-center py-16"><section className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"><p className="text-xs font-bold tracking-[0.16em] text-zinc-400">WELCOME BACK</p><h1 className="mt-3 text-3xl font-bold">로그인</h1><form onSubmit={submit} className="mt-8 space-y-5"><input required name="email" type="email" placeholder="이메일" className="h-12 w-full rounded-lg border border-zinc-300 px-4" /><input required name="password" type="password" placeholder="비밀번호" className="h-12 w-full rounded-lg border border-zinc-300 px-4" />{error && <p className="text-sm text-red-600">{error}</p>}<button className="h-12 w-full rounded-lg bg-zinc-950 text-sm font-bold text-white">로그인</button></form><p className="mt-6 text-center text-sm text-zinc-500">아직 회원이 아니신가요? <Link href="/signup" className="font-bold underline">회원가입</Link></p></section></main>;
}
