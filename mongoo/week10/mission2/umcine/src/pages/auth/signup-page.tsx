import { useState } from "react";
import type { FormEvent } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";
import { Link } from "@tanstack/react-router";


const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 영문 대소문자, 숫자, 지정된 특수문자를 모두 포함한 8자 이상
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

const inputClass =
  "min-w-0 flex-1 rounded-md border border-gray-200 bg-white px-3 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-blue-600";

const errorClass = "mt-1 text-xs text-red-600";

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);

  const [duplicateCheck, setDuplicateCheck] = useState({
  email: DEFAULT_DUPLICATE_CHECK,
  nickname: DEFAULT_DUPLICATE_CHECK,
});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  value: DefaultFormValue,
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
        : `이미 사용 중인 ${label}이에요.`,
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-[380px]">
        <h1 className="mb-6 text-[28px] font-bold tracking-tight">
          회원가입
        </h1>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label
              htmlFor="signup-email"
              className="mb-2 block text-xs font-semibold"
            >
              이메일
            </label>

            <div className="relative flex">
              <input
                id="signup-email"
                type="email"
                disabled={duplicateCheck.email.isChecking}
                autoComplete="email"
                value={form.email}
                onChange={(e) =>
                  handleChangeField("email", e.target.value)
                }
                placeholder="name@example.com"
                aria-invalid={showEmailError}
                aria-describedby={
                  showEmailError ? "signup-email-error" : undefined
                }
                className={`${inputClass} pr-24`}
              />

              <button
              type="button"
              disabled={!isEmailValid || duplicateCheck.email.isChecking}
              onClick={() => handleCheckDuplicate("email")}
              className="absolute inset-y-0 right-3 text-xs font-semibold text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
                </button>
            </div>

            {showEmailError && (
              <p id="signup-email-error" className={errorClass}>
                올바른 이메일 형식으로 입력해 주세요.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="signup-nickname"
              className="mb-2 block text-xs font-semibold"
            >
              닉네임
            </label>

            <div className="relative flex">
              <input
                id="signup-nickname"
                type="text"
                disabled={duplicateCheck.nickname.isChecking}
                autoComplete="nickname"
                value={form.nickname}
                onChange={(e) =>
                  handleChangeField("nickname", e.target.value)
                }
                placeholder="2~12자"
                aria-invalid={showNicknameError}
                aria-describedby={
                  showNicknameError
                    ? "signup-nickname-error"
                    : undefined
                }
                className={`${inputClass} pr-24`}
              />

              <button
              type="button"
              disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
              onClick={() => handleCheckDuplicate("nickname")}
              className="absolute inset-y-0 right-3 text-xs font-semibold text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
                </button>
            </div>

            {showNicknameError && (
              <p id="signup-nickname-error" className={errorClass}>
                닉네임은 앞뒤 공백을 제외하고 2~12자로 입력해 주세요.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="signup-password"
              className="mb-2 block text-xs font-semibold"
            >
              비밀번호
            </label>

            <div className="flex">
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) =>
                  handleChangeField("password", e.target.value)
                }
                placeholder="8자 이상"
                aria-invalid={showPasswordError}
                aria-describedby={
                  showPasswordError
                    ? "signup-password-hint signup-password-error"
                    : "signup-password-hint"
                }
                className={inputClass}
              />
            </div>

            <p
              id="signup-password-hint"
              className="mt-1 text-[10px] leading-4 text-gray-400"
            >
              영문 대소문자, 숫자, 특수문자(!@#$%^&amp;*)를 모두
              포함해 8자 이상 입력해 주세요.
            </p>

            {showPasswordError && (
              <p id="signup-password-error" className={errorClass}>
                비밀번호 조건을 확인해 주세요.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="signup-password-confirm"
              className="mb-2 block text-xs font-semibold"
            >
              비밀번호 확인
            </label>

            <div className="flex">
              <input
                id="signup-password-confirm"
                type="password"
                autoComplete="new-password"
                value={form.passwordConfirm}
                onChange={(e) =>
                  handleChangeField("passwordConfirm", e.target.value)
                }
                placeholder="다시 입력"
                aria-invalid={showPasswordConfirmError}
                aria-describedby={
                  showPasswordConfirmError
                    ? "signup-password-confirm-error"
                    : undefined
                }
                className={inputClass}
              />
            </div>

            {showPasswordConfirmError && (
              <p
                id="signup-password-confirm-error"
                className={errorClass}
              >
                비밀번호가 일치하지 않아요.
              </p>
            )}
          </div>

          <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="w-full rounded-md bg-[#2563eb] py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "가입 중" : "가입하기"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-gray-500">
          이미 계정이 있나요?{" "}
          <Link to="/login" className="font-semibold text-blue-600">로그인
          </Link>
        </p>
      </div>
    </main>
  );
}