import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useLoginMutation } from "../../hooks/use-login-mutation";

const DEFAULT_FORM = {
  email: "",
  password: "",
};

//typeof DEFAULT_FROM 으로 객체의 타입을 가져오고, keyof로 키만 뽑기
type DefaultFormKey = keyof typeof DEFAULT_FORM;
//위 키들에 해당하는 값의 타입만 뽑기 -> 결과는 string(전부 string이므로)
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);

  //컴포넌트 본문에서 훅 호출하고 반환값 저장
  const loginMutation = useLoginMutation();
  const canSubmit =
    EMAIL_REGEX.test(form.email.trim()) && form.password.length > 0;

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: form.email.trim(),
      password: form.password,
    });
  };

  const emailInput = useRef<HTMLInputElement>(null);

  //어떤 입력칸이 바뀌었는지 key로 받아서 해당 필드만 갱신
  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const inputClassName =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-blue-600";

  return (
    <main className="flex min-h-[calc(100dvh-73px)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-4 text-3xl font-bold">로그인</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
                value={form.email}
                onChange={(e) => handleChangeField("email", e.target.value)}
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
              onChange={(e) => handleChangeField("password", e.target.value)}
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
            disabled={!canSubmit || loginMutation.isPending}
          >
            {loginMutation.isPending ? "로그인 중" : "로그인"}
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
