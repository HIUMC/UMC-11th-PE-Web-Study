"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { postJson } from "../lib/client-auth";

export default function SignupPage() {
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (form.get("password") !== form.get("passwordConfirm")) { setMessage("비밀번호 확인이 일치하지 않습니다."); return; }
    try { await postJson("members", { email: form.get("email"), nickname: form.get("nickname"), password: form.get("password") }); window.location.assign("/login"); } catch { setMessage("회원가입에 실패했습니다. 입력값을 확인해 주세요."); }
  }
  return <main className="mx-auto w-[min(520px,calc(100%-48px))] py-14 pb-24"><section className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm"><p className="text-xs font-bold tracking-[0.16em] text-zinc-400">CREATE ACCOUNT</p><h1 className="mt-3 text-3xl font-bold">회원가입</h1><form onSubmit={submit} className="mt-8 space-y-5"><input required name="email" type="email" placeholder="이메일" className="h-12 w-full rounded-lg border border-zinc-300 px-4" /><input required name="nickname" minLength={2} maxLength={12} placeholder="닉네임" className="h-12 w-full rounded-lg border border-zinc-300 px-4" /><input required name="password" type="password" minLength={8} placeholder="비밀번호" className="h-12 w-full rounded-lg border border-zinc-300 px-4" /><input required name="passwordConfirm" type="password" minLength={8} placeholder="비밀번호 확인" className="h-12 w-full rounded-lg border border-zinc-300 px-4" />{message && <p className="text-sm text-red-600">{message}</p>}<button className="h-12 w-full rounded-lg bg-zinc-950 text-sm font-bold text-white">가입하기</button></form><p className="mt-6 text-center text-sm text-zinc-500">이미 회원이신가요? <Link href="/login" className="font-bold underline">로그인</Link></p></section></main>;
}
