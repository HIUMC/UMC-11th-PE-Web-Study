"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useLoginMutation } from "../../hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLoginMutation();
  const canSubmit = EMAIL_REGEX.test(email.trim()) && password.length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: email.trim(),
      password,
    });
  };


  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-[380px]">
        <h1 className="mb-6 text-[28px] font-bold tracking-tight">
          로그인
        </h1>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="mb-2 block text-xs font-semibold"
            >
              이메일
            </label>

            <div className="relative">
              <img
                src="/icons/mail.svg"
                alt=""
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50"
              />

              <input
                id="login-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-md border border-gray-200 bg-white py-3 pl-10 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-2 block text-xs font-semibold"
            >
              비밀번호
            </label>

            <div className="relative">
              <img
                src="/icons/lock.svg"
                alt=""
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50"
              />

              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                className="w-full rounded-md border border-gray-200 bg-white py-3 pl-10 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-blue-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit || loginMutation.isPending}
            className="w-full rounded-md bg-[#2563eb] py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loginMutation.isPending ? "로그인 중" : "로그인"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-gray-500">
          처음이신가요?{" "}
          <Link
            href="/signup"
            className="font-semibold text-blue-600"
          >
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}