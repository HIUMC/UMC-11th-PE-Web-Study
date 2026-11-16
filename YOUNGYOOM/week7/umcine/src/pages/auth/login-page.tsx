import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailInput = useRef<HTMLInputElement>(null);

  const inputClassName =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-blue-600";

  return (
    <main className="flex min-h-[calc(100dvh-73px)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-4 text-3xl font-bold">로그인</h1>
        <form
          className="space-y-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-semibold"
            >
              이메일
            </label>
            <div className="relative">
              <input
                id="email"
                ref={emailInput}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                required
                className={`${inputClassName} pr-24`}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-semibold"
            >
              비밀번호
            </label>
            <input
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="8자 이상"
              minLength={8}
              required
              aria-describedby="password-help"
              className={inputClassName}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#2563EB] py-3 text-sm font-semibold text-white"
          >
            로그인
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-gray-500">
          처음이신가요?{" "}
          <Link to="/signup" className="font-semibold text-blue-600">
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}
