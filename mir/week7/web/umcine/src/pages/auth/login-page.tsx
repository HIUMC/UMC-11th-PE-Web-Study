import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { login } from "../../api/members/login";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_FORM = {
  email: "",
  password: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isPasswordValid = form.password.length > 0;
  const showEmailError = form.email.length > 0 && !isEmailValid;

  const isFormValid = isEmailValid && isPasswordValid;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await login({
        email: form.email.trim(),
        password: form.password,
      });
      localStorage.setItem("accessToken", response.result.accessToken);
      localStorage.setItem("nickname", response.result.nickname);
      localStorage.setItem("email", form.email.trim());
      alert(response.message);
      navigate({ to: "/my" });
    } catch {
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-91px)] items-center justify-center bg-[#f6f7f9] py-12">
      <form
        className="flex flex-col w-[430px] items-start gap-4 max-w-[calc(100%-32px)]"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* 타이틀 */}
        <div className="flex flex-col items-start self-stretch w-full">
          <h1 className="text-[34px] font-bold tracking-[-1.53px] leading-normal text-[#17191e]">
            로그인
          </h1>
        </div>

        {/* 1. 이메일 */}
        <div className="flex flex-col items-start gap-2 self-stretch w-full">
          <div className="flex flex-col items-start gap-2 self-stretch w-full">
            <label
              htmlFor="email"
              className="text-[13px] font-extrabold text-[#17191e] leading-normal"
            >
              이메일
            </label>
            <div
              className={`min-h-12 gap-2.5 px-[13px] py-3.5 bg-white rounded-lg border ${
                showEmailError ? "border-[#d92d20]" : "border-[#e3e6eb]"
              } border-solid flex items-center self-stretch w-full`}
            >
              <svg
                className="w-4 h-4 shrink-0 text-[#969da8]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                placeholder="name@example.com"
                autoComplete="email"
                aria-invalid={showEmailError}
                onChange={(e) => handleChangeField("email", e.target.value)}
                className="flex-1 w-full bg-transparent border-0 outline-none text-sm font-normal text-[#17191e] placeholder:text-[#969da8]"
              />
            </div>
          </div>
          {showEmailError && (
            <p className="text-[11px] font-normal text-[#d92d20]" role="alert">
              올바른 이메일 형식을 입력해 주세요
            </p>
          )}
        </div>

        {/* 2. 비밀번호 */}
        <div className="flex flex-col items-start gap-2 self-stretch w-full">
          <div className="flex flex-col items-start gap-2 self-stretch w-full">
            <label
              htmlFor="password"
              className="text-[13px] font-extrabold text-[#17191e] leading-normal"
            >
              비밀번호
            </label>
            <div className="min-h-12 gap-2.5 px-[13px] py-3.5 bg-white rounded-lg border border-[#e3e6eb] border-solid flex items-center self-stretch w-full">
              <svg
                className="w-4 h-4 shrink-0 text-[#969da8]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                placeholder="비밀번호"
                autoComplete="current-password"
                onChange={(e) => handleChangeField("password", e.target.value)}
                className="flex-1 w-full bg-transparent border-0 outline-none text-sm font-normal text-[#17191e] placeholder:text-[#969da8]"
              />
            </div>
          </div>
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="flex h-12 items-center justify-center px-4 py-0 self-stretch w-full bg-[#2563eb] rounded-lg border-0 enabled:hover:bg-[#1d4ed8] enabled:active:bg-[#1748ad] disabled:bg-[#d9e5ff] disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <span className="font-extrabold text-white text-sm text-center">
            {isSubmitting ? "로그인 중" : "로그인"}
          </span>
        </button>

        {/* 하단 회원가입 링크 */}
        <div className="flex items-center justify-center gap-1 self-stretch w-full">
          <span className="font-normal text-[#606774] text-[13px]">
            처음이신가요?
          </span>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center no-underline"
          >
            <span className="font-extrabold text-[#2563eb] text-xs whitespace-nowrap">
              회원가입
            </span>
          </Link>
        </div>
      </form>
    </main>
  );
}
