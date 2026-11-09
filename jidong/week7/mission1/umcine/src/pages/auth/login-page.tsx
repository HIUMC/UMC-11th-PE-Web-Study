import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { FormField } from "../../components/auth/form-field";
import { isValidEmail } from "../../utils/members/validation";

const DEFAULT_FORM = {
  email: "",
  password: "",
};

type LoginFormKey = keyof typeof DEFAULT_FORM;

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);

  const isEmailValid = isValidEmail(form.email);
  const isPasswordFilled = form.password.length > 0;
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const canSubmit = isEmailValid && isPasswordFilled;

  const handleChangeField = (key: LoginFormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    // 로그인 API는 8주차에 연결 예정
    alert(`${form.email.trim()} 계정으로 로그인할게요. (API는 8주차에 연결돼요)`);
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-6 py-12">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-[360px] flex-col gap-4"
      >
        <h1 className="text-2xl font-bold">로그인</h1>

        <FormField
          id="login-email"
          label="이메일"
          type="email"
          icon="/icons/mail.svg"
          placeholder="name@example.com"
          autoComplete="email"
          value={form.email}
          errorMessage={showEmailError ? "올바른 이메일 형식이 아니에요." : null}
          onChange={(value) => handleChangeField("email", value)}
        />

        <FormField
          id="login-password"
          label="비밀번호"
          type="password"
          icon="/icons/lock.svg"
          placeholder="비밀번호를 입력해 주세요"
          autoComplete="current-password"
          value={form.password}
          onChange={(value) => handleChangeField("password", value)}
        />

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-2 rounded-md bg-blue-600 py-3 text-sm font-bold text-white disabled:bg-blue-300"
        >
          로그인
        </button>
        <p className="text-center text-xs text-gray-500">
          아직 계정이 없나요?{" "}
          <Link to="/signup" className="font-bold text-blue-600">
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}
