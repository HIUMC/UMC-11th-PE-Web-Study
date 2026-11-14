import { Link } from "@tanstack/react-router";
import { useState } from "react";


export function LoginPage() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        });
  return (
    <main className="min-h-[calc(100vh-148px)] bg-[#f6f7f9] px-4 py-16">
      <form
        className="mx-auto flex w-full max-w-[430px] flex-col gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <h1 className="text-[32px] leading-[38px] font-extrabold tracking-tight text-[#17191e]">
          로그인
        </h1>

        {/* 이메일 입력 */}
        <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-extrabold text-[#17191e]">
                이메일
            </label>

            <div className="flex h-12 items-center gap-2 rounded-lg border border-[#e3e6eb] bg-white px-4 focus-within:ring-2 focus-within:ring-[#2563eb]">
                <img
                src="/icons/movie-icons/mail.svg"
                alt=""
                className="h-4 w-4 shrink-0"
                />
                <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#969da8]"
                />
            </div>
        </div>

        {/* 비밀번호 입력 */}
        <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-extrabold text-[#17191e]">
                비밀번호
            </label>

            <div className="flex h-12 items-center gap-2 rounded-lg border border-[#e3e6eb] bg-white px-4 focus-within:ring-2 focus-within:ring-[#2563eb]">
                <img
                src="/icons/movie-icons/lock.svg"
                alt=""
                className="h-4 w-4 shrink-0"
                />
                <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="비밀번호"
                value={form.password}
                onChange={(e) =>
                // prev로 이메일 입력시 이전에 입력된 비밀번호 지워지는 케이스 방지
                setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#969da8]"
                />
            </div>
        </div>

        <button
          type="submit"
          className="h-12 w-full cursor-pointer rounded-lg bg-[#2563eb] text-sm font-extrabold text-white hover:bg-blue-700"
        >
          로그인
        </button>

        <p className="flex items-center justify-center gap-1 text-xs text-[#606774]">
          처음이신가요?
          <Link
            to="/signup"
            className="font-extrabold text-[#2563eb] hover:underline"
          >
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}