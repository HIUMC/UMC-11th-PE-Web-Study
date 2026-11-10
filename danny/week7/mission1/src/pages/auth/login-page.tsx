import { useNavigate } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { useProfileStore } from "../../stores/profile-store";

export function LoginPage() {
  const navigate = useNavigate();
  const logIn = useProfileStore((state) => state.logIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    logIn(email.trim());
    navigate({ to: "/me" });
  }

  return (
    <main className="flex justify-center px-4 pt-[309px] pb-24">
      <form onSubmit={handleSubmit} className="w-full max-w-[430px]">
        <h1 className="mb-3 text-3xl font-bold text-ink">로그인</h1>

        <label htmlFor="login-email" className="text-xs font-bold text-ink">
          이메일
        </label>
        <div className="mt-2 flex h-12 items-center gap-1.5 rounded-lg border border-border bg-surface px-4 focus-within:border-ink">
          <img src="/icons/mail.svg" alt="" className="h-3.5 w-3.5 opacity-60" />
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
          />
        </div>

        <label
          htmlFor="login-password"
          className="mt-4 block text-xs font-bold text-ink"
        >
          비밀번호
        </label>
        <div className="mt-2 flex h-12 items-center gap-1.5 rounded-lg border border-border bg-surface px-4 focus-within:border-ink">
          <img src="/icons/lock.svg" alt="" className="h-3.5 w-3.5 opacity-60" />
          <input
            id="login-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호"
            className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="mt-4 h-[46px] w-full rounded-md bg-brand text-sm font-bold text-surface transition-colors hover:bg-brand-hover active:bg-brand-pressed"
        >
          로그인
        </button>

        <p className="mt-6 text-center text-xs text-ink-muted">
          처음이신가요? <span className="font-bold text-brand">회원가입</span>
        </p>
      </form>
    </main>
  );
}
