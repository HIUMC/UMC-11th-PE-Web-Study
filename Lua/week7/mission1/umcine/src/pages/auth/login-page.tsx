import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) { setMessage("이메일과 비밀번호를 모두 입력해 주세요."); return; }
    navigate({ to: "/my-page" });
  };

  return <main className="mx-auto flex min-h-[calc(100vh-76px)] w-[min(440px,calc(100%-48px))] items-center py-16"><section className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm sm:p-10"><p className="text-xs font-bold tracking-[0.16em] text-zinc-400">WELCOME BACK</p><h1 className="mt-3 text-3xl font-bold tracking-[-1.2px] text-zinc-950">로그인</h1><p className="mt-2 text-sm text-zinc-500">UMCine에서 보고 싶은 영화를 찾아보세요.</p><form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate><label className="block text-sm font-semibold text-zinc-800">이메일<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="umc@example.com" className="mt-2 h-12 w-full rounded-lg border border-zinc-300 px-4 text-base outline-none transition focus:border-zinc-900" /></label><label className="block text-sm font-semibold text-zinc-800">비밀번호<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="비밀번호를 입력해 주세요" className="mt-2 h-12 w-full rounded-lg border border-zinc-300 px-4 text-base outline-none transition focus:border-zinc-900" /></label>{message && <p className="text-sm text-red-600" role="alert">{message}</p>}<button type="submit" className="h-12 w-full rounded-lg bg-zinc-950 text-sm font-bold text-white transition hover:bg-zinc-700">로그인</button></form><p className="mt-6 text-center text-sm text-zinc-500">아직 회원이 아니신가요? <Link to="/signup" className="font-bold text-zinc-900 underline underline-offset-4">회원가입</Link></p></section></main>;
}
