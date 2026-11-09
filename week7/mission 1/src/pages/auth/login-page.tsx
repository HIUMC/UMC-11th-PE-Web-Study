import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const showEmailError = email.length > 0 && !isEmailValid;
  const canSubmit = isEmailValid && password.length > 0;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    setNotice("로그인 기능은 준비 중입니다. 현재는 화면 미리보기만 제공됩니다.");
  };

  return (
    <main className="flex min-h-[calc(100dvh-90px)] flex-1 items-center px-4 py-16">
      <section className="mx-auto w-full max-w-[424px]" aria-labelledby="login-title">
        <h1 id="login-title" className="mb-5 text-[32px] leading-10 font-bold tracking-[-0.04em]">로그인</h1>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="login-email" className="mb-1.5 block text-[13px] leading-5 font-bold">이메일</label>
          <div className={`flex h-12 items-center gap-2 rounded-lg border bg-white px-3.5 focus-within:border-[#4f60ee] focus-within:ring-2 focus-within:ring-[#4f60ee]/15 ${showEmailError ? "border-red-400" : "border-gray-200"}`}>
            <svg aria-hidden="true" className="size-3.5 shrink-0 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2.5" y="4.5" width="19" height="15" rx="1.5" />
              <path d="m3 6 9 7 9-7" />
            </svg>
            <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            required
            placeholder="name@example.com"
            value={email}
            onChange={(event) => { setEmail(event.target.value); setNotice(""); }}
            aria-invalid={showEmailError}
            aria-describedby={showEmailError ? "login-email-error" : undefined}
            className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
          </div>
          {showEmailError && <p id="login-email-error" className="mt-1 text-xs text-red-600" aria-live="polite">이메일 형식을 확인해 주세요.</p>}
        </div>
        <div>
          <label htmlFor="login-password" className="mb-1.5 block text-[13px] leading-5 font-bold">비밀번호</label>
          <div className="flex h-12 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 focus-within:border-[#4f60ee] focus-within:ring-2 focus-within:ring-[#4f60ee]/15">
            <svg aria-hidden="true" className="size-3.5 shrink-0 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4.5" y="10" width="15" height="12" rx="2" />
              <path d="M8 10V6a4 4 0 0 1 8 0v4" />
              <circle cx="12" cy="16" r="1" />
            </svg>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="비밀번호"
              value={password}
              onChange={(event) => { setPassword(event.target.value); setNotice(""); }}
              className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>
        </div>
        <button type="submit" disabled={!canSubmit} className="h-[46px] w-full rounded-md bg-[#4f60ee] text-sm font-bold text-white transition enabled:cursor-pointer enabled:hover:bg-[#4052de] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f60ee] disabled:cursor-not-allowed">로그인</button>
        {notice && <p role="status" className="text-center text-xs leading-5 text-gray-500">{notice}</p>}
      </form>
      <p className="mt-5 flex justify-center gap-1 text-xs leading-5 text-gray-500">
        처음이신가요? <Link to="/signup" className="font-bold text-[#4f60ee] hover:underline">회원가입</Link>
      </p>
      </section>
    </main>
  );
}
