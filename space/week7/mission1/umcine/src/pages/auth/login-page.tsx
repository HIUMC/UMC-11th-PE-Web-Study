import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { login } from "../../api/members/login";
import { useAuthStore } from "../../stores/auth-store";
import { getApiErrorMessage } from "../../utils/api-error-message";

export function LoginPage() {
  const navigate = useNavigate({ from: "/login" });
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const sessionExpired = useAuthStore((state) => state.sessionExpired);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const response = await login({ email: email.trim(), password });
      setAccessToken(response.result.accessToken);
      await navigate({ to: "/my-info" });
    } catch (error) {
      setErrorMessage(
        await getApiErrorMessage(error, "로그인에 실패했어요. 다시 시도해 주세요."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClassName =
    "h-11 w-full rounded-lg border border-border-default bg-bg-surface px-3.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-action-primary";

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-12">
      <section className="w-full max-w-[440px]">
        <h1 className="mb-6 text-2xl leading-8 font-bold tracking-tight text-text-primary">
          로그인
        </h1>

        {sessionExpired ? (
          <p className="mb-3 text-sm text-text-danger" role="alert">
            로그인이 만료되었어요. 다시 로그인해 주세요.
          </p>
        ) : null}
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label
              className="text-sm leading-5 font-bold text-text-primary"
              htmlFor="login-email"
            >
              이메일
            </label>
            <div className="relative">
              <img
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 opacity-60"
                src="/icons/mail.svg"
                alt=""
                aria-hidden="true"
              />
              <input
                className={`${inputClassName} pl-9`}
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-sm leading-5 font-bold text-text-primary"
              htmlFor="login-password"
            >
              비밀번호
            </label>
            <div className="relative">
              <img
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 opacity-60"
                src="/icons/lock.svg"
                alt=""
                aria-hidden="true"
              />
              <input
                className={`${inputClassName} pl-9`}
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="비밀번호"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            className="mt-1 h-11 rounded-lg bg-action-primary px-4 text-sm font-extrabold text-bg-surface transition-colors hover:bg-action-primary-hover disabled:cursor-not-allowed disabled:bg-action-disabled"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "로그인 중" : "로그인"}
          </button>
          {errorMessage ? (
            <p className="text-center text-xs text-text-danger" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </form>

        <p className="mt-4 text-center text-xs text-text-secondary">
          처음이신가요?{" "}
          <Link
            className="font-bold text-action-primary hover:underline"
            to="/signup"
          >
            회원가입
          </Link>
        </p>
      </section>
    </main>
  );
}
