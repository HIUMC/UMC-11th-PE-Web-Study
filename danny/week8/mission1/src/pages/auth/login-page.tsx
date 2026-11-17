import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { loginMutationOptions } from "../../api/member-queries";
import { getServerErrorMessage } from "../../api/request-error";
import { useAuthStore } from "../../stores/auth-store";

export function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });
  const storeToken = useAuthStore((state) => state.logIn);
  const loginMutation = useMutation(loginMutationOptions());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    loginMutation.mutate(
      { email: email.trim(), password },
      {
        onSuccess: ({ accessToken }) => {
          storeToken(accessToken);
          navigate({ href: redirect ?? "/me", replace: true });
        },
      },
    );
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

        {loginMutation.isError && (
          <p role="alert" className="mt-3 text-xs font-medium text-danger">
            {getServerErrorMessage(loginMutation.error)}
          </p>
        )}

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="mt-4 h-[46px] w-full rounded-md bg-brand text-sm font-bold text-surface transition-colors hover:bg-brand-hover active:bg-brand-pressed disabled:bg-brand-disabled"
        >
          {loginMutation.isPending ? "로그인 중…" : "로그인"}
        </button>

        <p className="mt-6 text-center text-xs text-ink-muted">
          처음이신가요?{" "}
          <Link to="/signup" className="font-bold text-brand">
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}
