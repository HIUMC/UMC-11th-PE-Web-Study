import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useLoginMutation } from "../../hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const loginMutation = useLoginMutation();
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const canSubmit = isEmailValid && form.password.length > 0;
  const inputClass = "h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm outline-none placeholder:text-gray-400 focus:border-blue-600 disabled:opacity-60";

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;
    loginMutation.mutate({ email: form.email.trim(), password: form.password });
  };

  return (
    <main className="flex min-h-[calc(100vh-88px)] flex-1 items-center justify-center bg-[#f5f6f8] px-5 py-12">
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-[424px]">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">로그인</h1>
        <div className="mb-4">
          <label htmlFor="login-email" className="mb-2 block text-xs font-bold text-gray-900">이메일</label>
          <input
            id="login-email" type="email" autoComplete="email" placeholder="name@example.com"
            className={inputClass} value={form.email} disabled={loginMutation.isPending}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
          {form.email.length > 0 && !isEmailValid && <p className="mt-1.5 text-[10px] leading-4 text-[#d85b50]">올바른 이메일 형식으로 입력해 주세요.</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="login-password" className="mb-2 block text-xs font-bold text-gray-900">비밀번호</label>
          <input
            id="login-password" type="password" autoComplete="current-password" placeholder="비밀번호를 입력해 주세요"
            className={inputClass} value={form.password} disabled={loginMutation.isPending}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          />
        </div>
        <button type="submit" disabled={!canSubmit || loginMutation.isPending} className="h-11 w-full rounded-lg bg-blue-600 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-[#9db5f2]">
          {loginMutation.isPending ? "로그인 중" : "로그인"}
        </button>
        <p className="mt-4 text-center text-xs text-gray-500">
          아직 계정이 없나요?{" "}<Link to="/signup" className="font-bold text-blue-600 no-underline">회원가입</Link>
        </p>
      </form>
    </main>
  );
}
