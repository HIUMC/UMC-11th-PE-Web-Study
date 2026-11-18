import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { FormField, primaryButtonClass } from "../../components/auth/form-field";
import { useLoginMutation } from "../../hooks/use-login-mutation";
import { getMemberErrorMessage } from "../../api/api-client";
import { EMAIL_REGEX } from "../../utils/auth-validation";

export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const loginMutation = useLoginMutation();
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const canSubmit = isEmailValid && form.password.length > 0;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;
    loginMutation.mutate({ email: form.email.trim(), password: form.password });
  }

  return (
    <main className="flex flex-1 justify-center px-4 py-16 sm:py-24">
      <section className="w-full max-w-108" aria-labelledby="login-title">
        <h1 id="login-title" className="mb-8 text-3xl font-extrabold tracking-tight">로그인</h1>
        <form onSubmit={handleSubmit} noValidate aria-busy={loginMutation.isPending}>
          <fieldset disabled={loginMutation.isPending} className="space-y-5">
            <legend className="sr-only">로그인 정보</legend>
            <FormField id="login-email" label="이메일" type="email" name="email" autoComplete="username"
              placeholder="name@example.com" value={form.email} error={form.email && !isEmailValid ? "올바른 이메일을 입력해 주세요." : undefined}
              onChange={event => { setForm(previous => ({ ...previous, email: event.target.value })); loginMutation.reset(); }} />
            <FormField id="login-password" label="비밀번호" type="password" name="password" autoComplete="current-password"
              placeholder="비밀번호를 입력해 주세요" value={form.password}
              onChange={event => { setForm(previous => ({ ...previous, password: event.target.value })); loginMutation.reset(); }} />
            <button type="submit" className={primaryButtonClass} disabled={!canSubmit || loginMutation.isPending}>
              {loginMutation.isPending ? "로그인 중" : "로그인"}
            </button>
          </fieldset>
        </form>
        {loginMutation.isError && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-4 text-sm leading-6 text-red-700">
          {getMemberErrorMessage(loginMutation.error, "로그인에 실패했어요. 다시 시도해 주세요.")}
        </p>}
        <p className="mt-6 text-center text-sm text-slate-500">아직 계정이 없나요? <Link to="/signup" className="font-bold text-blue-600 underline">회원가입</Link></p>
      </section>
    </main>
  );
}
