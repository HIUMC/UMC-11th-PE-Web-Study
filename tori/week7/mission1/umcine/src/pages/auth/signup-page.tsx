import { useState } from "react";

import { checkEmailDuplicate } from "@/api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "@/api/members/check-nickname-duplicate";
import { signup } from "@/api/members/signup";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());

  const isNicknameValid =
    form.nickname.trim().length >= 2 &&
    form.nickname.trim().length <= 12;

  const isPasswordValid = PASSWORD_REGEX.test(form.password);

  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 &&
    form.password === form.passwordConfirm;

  const showEmailError = form.email.length > 0 && !isEmailValid;

  const showNicknameError =
    form.nickname.length > 0 && !isNicknameValid;

  const showPasswordError =
    form.password.length > 0 && !isPasswordValid;

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

  const handleChangeField = (
    key: DefaultFormKey,
    value: DefaultFormValue
  ) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;

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
      [key]: {
        isChecking: true,
        isAvailable: false,
      },
    }));

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim());

      const isAvailable = response.available;

      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          isAvailable,
        },
      }));

      alert(
        isAvailable
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`
      );
    } catch {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          isAvailable: false,
        },
      }));

      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          isChecking: false,
        },
      }));
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
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
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "h-11 w-full rounded-md border border-border bg-white px-3 text-sm outline-none transition focus:border-primary";

  const labelClass = "mb-2 block text-sm font-semibold";

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-[400px]"
      >
        <h1 className="mb-6 text-2xl font-bold">회원가입</h1>

        {/* 이메일 */}
        <div className="mb-4">
          <label className={labelClass}>이메일</label>

          <div className="flex h-11 overflow-hidden rounded-md border border-border bg-white focus-within:border-primary">
            <input
              type="email"
              value={form.email}
              disabled={duplicateCheck.email.isChecking}
              onChange={(e) =>
                handleChangeField("email", e.target.value)
              }
              placeholder="name@example.com"
              className="min-w-0 flex-1 px-3 text-sm outline-none"
            />

            <button
              type="button"
              disabled={
                !isEmailValid || duplicateCheck.email.isChecking
              }
              onClick={() => handleCheckDuplicate("email")}
              className="px-3 text-xs font-semibold text-primary disabled:text-gray-300"
            >
              {duplicateCheck.email.isChecking
                ? "확인 중"
                : "중복 확인"}
            </button>
          </div>

          {showEmailError && (
            <p className="mt-1 text-xs text-red-500">
              올바른 이메일 형식이 아닙니다.
            </p>
          )}

          {duplicateCheck.email.isAvailable && (
            <p className="mt-1 text-xs text-green-600">
              사용 가능한 이메일입니다.
            </p>
          )}
        </div>

        {/* 닉네임 */}
        <div className="mb-4">
          <label className={labelClass}>닉네임</label>

          <div className="flex h-11 overflow-hidden rounded-md border border-border bg-white focus-within:border-primary">
            <input
              type="text"
              value={form.nickname}
              disabled={duplicateCheck.nickname.isChecking}
              onChange={(e) =>
                handleChangeField("nickname", e.target.value)
              }
              placeholder="2~12자"
              className="min-w-0 flex-1 px-3 text-sm outline-none"
            />

            <button
              type="button"
              disabled={
                !isNicknameValid ||
                duplicateCheck.nickname.isChecking
              }
              onClick={() => handleCheckDuplicate("nickname")}
              className="px-3 text-xs font-semibold text-primary disabled:text-gray-300"
            >
              {duplicateCheck.nickname.isChecking
                ? "확인 중"
                : "중복 확인"}
            </button>
          </div>

          {showNicknameError && (
            <p className="mt-1 text-xs text-red-500">
              닉네임은 2~12자로 입력해야 합니다.
            </p>
          )}

          {duplicateCheck.nickname.isAvailable && (
            <p className="mt-1 text-xs text-green-600">
              사용 가능한 닉네임입니다.
            </p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="mb-4">
          <label className={labelClass}>비밀번호</label>

          <input
            type="password"
            value={form.password}
            onChange={(e) =>
              handleChangeField("password", e.target.value)
            }
            placeholder="8자 이상"
            className={inputClass}
          />

          <p className="mt-1 text-xs text-gray-400">
            영문 대소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요.
          </p>

          {showPasswordError && (
            <p className="mt-1 text-xs text-red-500">
              비밀번호 형식이 올바르지 않습니다.
            </p>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div className="mb-5">
          <label className={labelClass}>비밀번호 확인</label>

          <input
            type="password"
            value={form.passwordConfirm}
            onChange={(e) =>
              handleChangeField("passwordConfirm", e.target.value)
            }
            placeholder="다시 입력"
            className={inputClass}
          />

          {showPasswordConfirmError && (
            <p className="mt-1 text-xs text-red-500">
              비밀번호가 일치하지 않습니다.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="h-11 w-full rounded-md bg-primary text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>

        <p className="mt-4 text-center text-xs text-gray-400">
          이미 계정이 있나요?{" "}
          <a href="/login" className="font-semibold text-primary">
            로그인
          </a>
        </p>
      </form>
    </main>
  );
}