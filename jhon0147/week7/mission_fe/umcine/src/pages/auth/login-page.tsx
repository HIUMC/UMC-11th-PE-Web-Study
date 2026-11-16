import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { FormField, primaryButtonClass } from "../../components/auth/form-field";
import { EMAIL_REGEX } from "../../utils/auth-validation";

export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isEmailValid || !form.password) return;
    setMessage("입력값을 확인했어요. 로그인 연결은 준비 중이에요.");
  }

  return (
    <main className="flex flex-1 justify-center px-4 py-16 sm:py-24">
      <section className="w-full max-w-108" aria-labelledby="login-title">
        <h1 id="login-title" className="mb-8 text-3xl font-extrabold tracking-tight">로그인</h1>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FormField id="login-email" label="이메일" type="email" name="email" autoComplete="username"
            placeholder="name@example.com" value={form.email} error={form.email && !isEmailValid ? "올바른 이메일을 입력해 주세요." : undefined}
            onChange={event => { setForm(previous => ({ ...previous, email: event.target.value })); setMessage(""); }} />
          <FormField id="login-password" label="비밀번호" type="password" name="password" autoComplete="current-password"
            placeholder="비밀번호를 입력해 주세요" value={form.password}
            onChange={event => { setForm(previous => ({ ...previous, password: event.target.value })); setMessage(""); }} />
          <button type="submit" className={primaryButtonClass} disabled={!isEmailValid || !form.password}>로그인</button>
        </form>
        {message && <p role="status" className="mt-4 rounded-lg bg-blue-50 p-4 text-sm leading-6 text-blue-800">{message}</p>}
        <p className="mt-6 text-center text-sm text-slate-500">아직 계정이 없나요? <Link to="/signup" className="font-bold text-blue-600 underline">회원가입</Link></p>
      </section>
    </main>
  );
}
