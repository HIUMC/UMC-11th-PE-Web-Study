import { useState, type SubmitEvent } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { Link, useNavigate } from "@tanstack/react-router";
import { getApiErrorMessage } from "../../utils/api-error-message";
import { signup } from "../../api/members/signup";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

type FormKey = keyof typeof DEFAULT_FORM;
type FormValue = (typeof DEFAULT_FORM)[FormKey];

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const trimmedNickname = form.nickname.trim();
  const isNicknameValid =
    trimmedNickname.length >= 2 && trimmedNickname.length <= 12;
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

  function handleChangeField(key: FormKey, value: FormValue) {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      setDuplicateCheck((previous) => ({
        ...previous,
        [key]: DEFAULT_DUPLICATE_CHECK,
      }));
    }
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  async function handleCheckDuplicate(key: DuplicateCheckKey) {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = key === "email" ? "이메일" : "닉네임";
    setDuplicateCheck((previous) => ({
      ...previous,
      [key]: { isChecking: true, isAvailable: false },
    }));

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim());
      const isAvailable = response.available;
      setDuplicateCheck((previous) => ({
        ...previous,
        [key]: { ...previous[key], isAvailable },
      }));
      alert(
        isAvailable
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      );
    } catch {
      setDuplicateCheck((previous) => ({
        ...previous,
        [key]: { ...previous[key], isAvailable: false },
      }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((previous) => ({
        ...previous,
        [key]: { ...previous[key], isChecking: false },
      }));
    }
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });
      alert(response.message);
      await navigate({ to: "/login" });
    } catch (error) {
      alert(getApiErrorMessage(error, "회원가입에 실패했어요. 다시 시도해 주세요."));
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldClassName =
    "flex h-12 w-full items-center rounded-lg border border-border-default bg-bg-surface px-3.5 transition-colors focus-within:border-action-primary";
  const inputClassName =
    "min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary";

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 sm:py-12">
      <section className="w-full max-w-[440px]">
        <h1 className="mb-6 text-2xl leading-8 font-bold tracking-tight text-text-primary">
          회원가입
        </h1>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-1">
            <label
              className="text-sm leading-5 font-bold text-text-primary"
              htmlFor="email"
            >
              이메일
            </label>
            <div className={fieldClassName}>
              <input
                className={inputClassName}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                disabled={duplicateCheck.email.isChecking}
                value={form.email}
                onChange={(event) =>
                  handleChangeField("email", event.currentTarget.value)
                }
                aria-invalid={showEmailError}
                aria-describedby={showEmailError ? "email-error" : undefined}
              />
              <button
                className="ml-3 shrink-0 text-xs font-bold text-action-primary disabled:cursor-not-allowed"
                type="button"
                disabled={!isEmailValid || duplicateCheck.email.isChecking}
                onClick={() => handleCheckDuplicate("email")}
              >
                {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            {showEmailError ? (
              <p
                className="text-xs text-text-danger"
                id="email-error"
                role="alert"
              >
                올바른 이메일 형식을 입력해 주세요.
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-sm leading-5 font-bold text-text-primary"
              htmlFor="nickname"
            >
              닉네임
            </label>
            <div className={fieldClassName}>
              <input
                className={inputClassName}
                id="nickname"
                name="nickname"
                type="text"
                autoComplete="nickname"
                placeholder="2~12자"
                disabled={duplicateCheck.nickname.isChecking}
                value={form.nickname}
                onChange={(event) =>
                  handleChangeField("nickname", event.currentTarget.value)
                }
                aria-invalid={showNicknameError}
                aria-describedby={
                  showNicknameError ? "nickname-error" : undefined
                }
              />
              <button
                className="ml-3 shrink-0 text-xs font-bold text-action-primary disabled:cursor-not-allowed"
                type="button"
                disabled={
                  !isNicknameValid || duplicateCheck.nickname.isChecking
                }
                onClick={() => handleCheckDuplicate("nickname")}
              >
                {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            {showNicknameError ? (
              <p
                className="text-xs text-text-danger"
                id="nickname-error"
                role="alert"
              >
                닉네임은 공백을 제외하고 2~12자로 입력해 주세요.
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-sm leading-5 font-bold text-text-primary"
              htmlFor="password"
            >
              비밀번호
            </label>
            <div className={fieldClassName}>
              <input
                className={inputClassName}
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="8자 이상"
                value={form.password}
                onChange={(event) =>
                  handleChangeField("password", event.currentTarget.value)
                }
                aria-invalid={showPasswordError}
                aria-describedby="password-hint"
              />
            </div>
            <p className="text-[11px] leading-4 text-text-tertiary" id="password-hint">
              영문 대소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요.
            </p>
            {showPasswordError ? (
              <p className="text-xs text-text-danger" role="alert">
                비밀번호 형식이 올바르지 않습니다.
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-sm leading-5 font-bold text-text-primary"
              htmlFor="password-confirm"
            >
              비밀번호 확인
            </label>
            <div className={fieldClassName}>
              <input
                className={inputClassName}
                id="password-confirm"
                name="passwordConfirm"
                type="password"
                autoComplete="new-password"
                placeholder="다시 입력"
                value={form.passwordConfirm}
                onChange={(event) =>
                  handleChangeField("passwordConfirm", event.currentTarget.value)
                }
                aria-invalid={showPasswordConfirmError}
                aria-describedby={
                  showPasswordConfirmError
                    ? "password-confirm-error"
                    : undefined
                }
              />
            </div>
            {showPasswordConfirmError ? (
              <p
                className="text-xs text-text-danger"
                id="password-confirm-error"
                role="alert"
              >
                비밀번호가 일치하지 않습니다.
              </p>
            ) : null}
          </div>

          <button
            className="mt-1 h-12 rounded-lg bg-action-primary px-4 text-sm font-extrabold text-bg-surface transition-colors hover:bg-action-primary-hover disabled:cursor-not-allowed disabled:bg-action-disabled"
            type="submit"
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? "가입 중" : "가입하기"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-text-secondary">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="font-bold text-action-primary hover:underline">로그인</Link>
        </p>
      </section>
    </main>
  );
}
