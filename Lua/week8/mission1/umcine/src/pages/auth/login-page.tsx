import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useLoginMutation } from "../../hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const loginMutation = useLoginMutation();
  const canSubmit = EMAIL_REGEX.test(form.email.trim()) && form.password.length > 0;
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (!canSubmit || loginMutation.isPending) return; loginMutation.mutate({ email: form.email.trim(), password: form.password }); };
  return <main className="mx-auto flex min-h-[calc(100vh-76px)] w-[min(440px,calc(100%-48px))] items-center py-16"><section className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm sm:p-10"><p className="text-xs font-bold tracking-[0.16em] text-zinc-400">WELCOME BACK</p><h1 className="mt-3 text-3xl font-bold tracking-[-1.2px] text-zinc-950">로그인</h1><form className="mt-8 space-y-5" onSubmit={handleSubmit}><label className="block text-sm font-semibold">이메일<input value={form.email} onChange={(event) => setForm((previous) => ({ ...previous, email: event.target.value }))} type="email" className="mt-2 h-12 w-full rounded-lg border border-zinc-300 px-4 font-normal" /></label><label className="block text-sm font-semibold">비밀번호<input value={form.password} onChange={(event) => setForm((previous) => ({ ...previous, password: event.target.value }))} type="password" className="mt-2 h-12 w-full rounded-lg border border-zinc-300 px-4 font-normal" /></label><button type="submit" disabled={!canSubmit || loginMutation.isPending} className="h-12 w-full rounded-lg bg-zinc-950 text-sm font-bold text-white disabled:bg-zinc-300">{loginMutation.isPending ? "로그인 중" : "로그인"}</button></form><p className="mt-6 text-center text-sm text-zinc-500">아직 회원이 아니신가요? <Link to="/signup" className="font-bold text-zinc-900 underline">회원가입</Link></p></section></main>;
}
