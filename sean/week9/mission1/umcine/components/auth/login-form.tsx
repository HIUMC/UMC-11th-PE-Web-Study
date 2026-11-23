"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useLoginMutation } from "@/hooks/use-login-mutation";
import { useAuthHydrated, useAuthStore } from "@/stores/auth-store";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function MailIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-neutral-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-neutral-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function LoginForm() {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLoginMutation();

  // TanStack Router의 beforeLoad + redirect를 대신합니다.
  // 토큰은 localStorage에 있어 서버가 알 수 없으므로, 브라우저에서 확인한 뒤 돌려보냅니다.
  useEffect(() => {
    if (hydrated && accessToken) {
      router.replace("/");
    }
  }, [hydrated, accessToken, router]);

  const isEmailValid = EMAIL_REGEX.test(email.trim());
  const showEmailError = email.length > 0 && !isEmailValid;
  const canSubmit = isEmailValid && password.length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({ email: email.trim(), password });
  }

  return (
    <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-[#f5f6f8] px-6 py-30">
      <div className="w-full max-w-[440px]">
        <h1 className="text-[28px] font-bold text-neutral-900">로그인</h1>

        <form onSubmit={handleSubmit} noValidate className="mt-7">
          <label htmlFor="email" className="block text-sm font-bold text-neutral-900">
            이메일
          </label>
          <div className="mt-1.5 flex items-center gap-2.5 rounded-md border border-neutral-200 bg-white px-3.5 py-3">
            <MailIcon />
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="flex-1 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
            />
          </div>
          {showEmailError && (
            <p className="mt-1.5 text-xs text-red-600">올바른 이메일 형식이 아니에요.</p>
          )}

          <label
            htmlFor="password"
            className="mt-5 block text-sm font-bold text-neutral-900"
          >
            비밀번호
          </label>
          <div className="mt-1.5 flex items-center gap-2.5 rounded-md border border-neutral-200 bg-white px-3.5 py-3">
            <LockIcon />
            <input
              id="password"
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="flex-1 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit || loginMutation.isPending}
            className="mt-7 w-full cursor-pointer rounded-md bg-blue-600 py-3.5 text-sm font-bold text-white disabled:cursor-default disabled:bg-neutral-300"
          >
            {loginMutation.isPending ? "로그인 중" : "로그인"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-neutral-500">
          처음이신가요?{" "}
          <Link href="/signup" className="font-bold text-blue-600">
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}
