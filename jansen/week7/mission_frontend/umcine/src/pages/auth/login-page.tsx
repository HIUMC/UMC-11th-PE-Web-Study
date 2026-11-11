import { useState } from "react";
import { Link } from "@tanstack/react-router";

const labelClass = "mb-2 block text-sm font-bold text-gray-900";
const inputClass =
  "h-12 w-full rounded-lg border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-600";
const iconClass =
  "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400";

export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (key: "email" | "password", value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 8주차에서 로그인 API 연결
  };

  return (
    <main className="flex min-h-[calc(100vh-90px)] items-center justify-center bg-gray-100 px-4 py-16">
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-[430px]">
        <h1 className="mb-6 text-3xl font-extrabold text-gray-900">로그인</h1>

        <div className="mb-5">
          <label className={labelClass}>이메일</label>
          <div className="relative">
            <svg className={iconClass} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            <input
              type="email"
              placeholder="name@example.com"
              className={inputClass}
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className={labelClass}>비밀번호</label>
          <div className="relative">
            <svg className={iconClass} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            <input
              type="password"
              placeholder="비밀번호"
              className={inputClass}
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="h-12 w-full rounded-lg bg-blue-600 text-sm font-bold text-white"
        >
          로그인
        </button>

        <p className="mt-5 text-center text-xs text-gray-600">
          처음이신가요?{" "}
          <Link to="/signup" className="font-bold text-blue-600">
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}