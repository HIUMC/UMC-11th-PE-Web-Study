import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useLoginMutation } from "@/hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLoginMutation();

  const canSubmit =
    EMAIL_REGEX.test(email.trim()) &&
    password.length > 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: email.trim(),
      password,
    });
  };

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[400px]"
      >
        <h1 className="mb-6 text-2xl font-bold">로그인</h1>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold">
            이메일
          </label>

          <div className="flex h-11 items-center gap-2 rounded-md border border-border bg-white px-3 focus-within:border-primary">
            <img
              src="/icons/mail.svg"
              alt=""
              className="h-4 w-4"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full text-sm outline-none"
              required
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="mb-2 block text-sm font-semibold">
            비밀번호
          </label>

          <div className="flex h-11 items-center gap-2 rounded-md border border-border bg-white px-3 focus-within:border-primary">
            <img
              src="/icons/lock.svg"
              alt=""
              className="h-4 w-4"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="w-full text-sm outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || loginMutation.isPending}
          className="h-11 w-full rounded-md bg-primary text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {loginMutation.isPending ? "로그인 중" : "로그인"}
        </button>

        <p className="mt-5 text-center text-xs text-gray-400">
          처음이신가요?{" "}
          <Link
            to="/signup"
            className="font-semibold text-primary"
          >
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}