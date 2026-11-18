import { useState } from "react";
import { Link } from "@tanstack/react-router";
import mailOutlineIcon from "@/assets/icons/mail-outline.svg";
import lockOutlineIcon from "@/assets/icons/lock-outline.svg";
import { useLoginMutation } from "@/hooks/use-login-mutation";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_FORM = {
  email: "",
  password: "",
};

type FormKey = keyof typeof DEFAULT_FORM;

// 공통 스타일
const LABEL_CLASS = "text-[13px] font-extrabold text-[#17191e]";
const FIELD_BOX_CLASS =
  "flex min-h-12 items-center gap-1 rounded-lg border border-[#e3e6eb] bg-white px-[13px] py-[14px] focus-within:border-[#2563eb]";
const INPUT_CLASS =
  "min-w-0 flex-1 bg-transparent px-0.5 py-px text-sm text-[#17191e] outline-none placeholder:text-[#969da8]";

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const loginMutation = useLoginMutation();

  // 이메일 형식이 맞고 비밀번호를 입력했을 때만 제출 가능
  const canSubmit =
    EMAIL_REGEX.test(form.email.trim()) && form.password.length > 0;

  const handleChangeField = (key: FormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: form.email.trim(),
      password: form.password,
    });
  };

  return (
    <main className="flex min-h-[calc(100vh-148px)] items-center justify-center bg-[#f6f7f9]">
      <form
        onSubmit={handleSubmit}
        className="flex w-[430px] max-w-full flex-col gap-4"
      >
        <h1 className="text-[34px] font-bold tracking-[-1.53px] text-[#17191e]">
          로그인
        </h1>

        <div className="flex flex-col gap-2">
          <label htmlFor="login-email" className={LABEL_CLASS}>
            이메일
          </label>
          <div className={FIELD_BOX_CLASS}>
            <img src={mailOutlineIcon} alt="" className="size-4 shrink-0" />
            <input
              id="login-email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => handleChangeField("email", e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="login-password" className={LABEL_CLASS}>
            비밀번호
          </label>
          <div className={FIELD_BOX_CLASS}>
            <span className="relative size-4 shrink-0 overflow-clip">
              <span className="absolute inset-[4.17%_16.67%_8.33%_16.67%]">
                <img
                  src={lockOutlineIcon}
                  alt=""
                  className="absolute inset-0 block size-full max-w-none"
                />
              </span>
            </span>
            <input
              id="login-password"
              type="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={(e) => handleChangeField("password", e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || loginMutation.isPending}
          className="h-12 w-full rounded-lg bg-[#2563eb] px-4 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loginMutation.isPending ? "로그인 중" : "로그인"}
        </button>

        <div className="flex items-end justify-center pt-[5px]">
          <p className="text-[13px] text-[#606774]">처음이신가요?&nbsp;</p>
          <Link to="/signup" className="text-xs font-extrabold text-[#2563eb]">
            회원가입
          </Link>
        </div>
      </form>
    </main>
  );
}
