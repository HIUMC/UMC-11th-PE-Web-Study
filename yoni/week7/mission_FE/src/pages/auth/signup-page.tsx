import { useState } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";
// import { useNavigate } from "@tanstack/react-router";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: DefaultFormKey, value: string) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;

      // 값을 바꾸면 중복 확인을 다시 해야 해요.
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: DEFAULT_DUPLICATE_CHECK,
      }));
    }

    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = key === "email" ? "이메일" : "닉네임";

    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: { isChecking: true, isAvailable: false },
    }));

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim());

      const isAvailable = response.available;

      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable },
      }));

      alert(
        isAvailable
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      );
    } catch {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable: false },
      }));

      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isChecking: false },
      }));
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });
      alert(response.message);
      // 로그인 페이지 연결 후 주석 해제
      // navigate({ to: "/login" });
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-88px)] items-center justify-center bg-[#f5f6f8] px-5 py-12">
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-[424px]">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">회원가입</h1>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="mb-2 block text-xs font-bold text-gray-900"
          >
            이메일
          </label>

          <div className="flex h-11 items-center rounded-lg border border-gray-200 bg-white px-3.5 focus-within:border-blue-600">
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              disabled={duplicateCheck.email.isChecking}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
              value={form.email}
              onChange={(e) => handleChangeField("email", e.target.value)}
            />

            <button
              type="button"
              disabled={!isEmailValid || duplicateCheck.email.isChecking}
              onClick={() => handleCheckDuplicate("email")}
              className="ml-3 shrink-0 text-xs font-bold text-blue-600 disabled:cursor-not-allowed"
            >
              {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>

          {showEmailError && (
            <p className="mt-1.5 text-[10px] leading-4 text-[#d85b50]">
              올바른 이메일 형식으로 입력해 주세요.
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="nickname"
            className="mb-2 block text-xs font-bold text-gray-900"
          >
            닉네임
          </label>

          <div className="flex h-11 items-center rounded-lg border border-gray-200 bg-white px-3.5 focus-within:border-blue-600">
            <input
              id="nickname"
              type="text"
              autoComplete="nickname"
              placeholder="2–12자"
              disabled={duplicateCheck.nickname.isChecking}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
              value={form.nickname}
              onChange={(e) => handleChangeField("nickname", e.target.value)}
            />

            <button
              type="button"
              disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
              onClick={() => handleCheckDuplicate("nickname")}
              className="ml-3 shrink-0 text-xs font-bold text-blue-600 disabled:cursor-not-allowed"
            >
              {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>

          {showNicknameError && (
            <p className="mt-1.5 text-[10px] leading-4 text-[#d85b50]">
              닉네임은 2~12자로 입력해 주세요.
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="mb-2 block text-xs font-bold text-gray-900"
          >
            비밀번호
          </label>

          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="8자 이상"
            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm outline-none placeholder:text-gray-400 focus:border-blue-600"
            value={form.password}
            onChange={(e) => handleChangeField("password", e.target.value)}
          />

          <p className="mt-1 text-[10px] leading-4 text-gray-400">
            영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요.
          </p>

          {showPasswordError && (
            <p className="mt-1.5 text-[10px] leading-4 text-[#d85b50]">
              비밀번호를 다시 한 번 확인해주세요.
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="passwordConfirm"
            className="mb-2 block text-xs font-bold text-gray-900"
          >
            비밀번호 확인
          </label>

          <input
            id="passwordConfirm"
            type="password"
            autoComplete="new-password"
            placeholder="다시 입력"
            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm outline-none placeholder:text-gray-400 focus:border-blue-600"
            value={form.passwordConfirm}
            onChange={(e) =>
              handleChangeField("passwordConfirm", e.target.value)
            }
          />

          {showPasswordConfirmError && (
            <p className="mt-1.5 text-[10px] leading-4 text-[#d85b50]">
              비밀번호가 일치하지 않아요.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="h-11 w-full rounded-lg bg-blue-600 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-[#9db5f2]"
        >
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>

        <p className="mt-4 text-center text-xs text-gray-500">
          이미 계정이 있나요?{" "}
          <a href="/login" className="font-bold text-blue-600 no-underline">
            로그인
          </a>
        </p>
      </form>
    </main>
  );
}
