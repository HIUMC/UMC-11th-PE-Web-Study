import { useState } from "react";
import { checkEmailDuplicate } from "@/api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "@/api/members/check-nickname-duplicate";
import { signup } from "@/api/members/signup";
import { Link, useNavigate } from "@tanstack/react-router";

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
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

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });

  // 입력값의 유효성 검사
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  // 입력값의 유효성 검사 결과
  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  // 입력 조건과 두 중복 확인을 모두 통과해야 제출 가능
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 다시 중복 확인해야 함
      setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }));
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
      if (response.isSuccess) void navigate({ to: "/login" });
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      key: "email",
      label: "이메일",
      type: "email",
      placeholder: "name@example.com",
      autoComplete: "email",
      hasDuplicateCheck: true,
      error: showEmailError ? "이메일 형식을 확인해 주세요." : "",
    },
    {
      key: "nickname",
      label: "닉네임",
      type: "text",
      placeholder: "2~12자",
      autoComplete: "nickname",
      hasDuplicateCheck: true,
      error: showNicknameError ? "닉네임은 2~12자로 입력해 주세요." : "",
    },
    {
      key: "password",
      label: "비밀번호",
      type: "password",
      placeholder: "8자 이상",
      autoComplete: "new-password",
      hasDuplicateCheck: false,
      error: showPasswordError
        ? "영문 대·소문자, 숫자, 특수문자(!@#$%^&*)를 포함해 8자 이상 입력해 주세요."
        : "",
    },
    {
      key: "passwordConfirm",
      label: "비밀번호 확인",
      type: "password",
      placeholder: "다시 입력",
      autoComplete: "new-password",
      hasDuplicateCheck: false,
      error: showPasswordConfirmError ? "비밀번호가 일치하지 않습니다." : "",
    },
  ] satisfies Array<{
    key: DefaultFormKey;
    label: string;
    type: string;
    placeholder: string;
    autoComplete: string;
    hasDuplicateCheck: boolean;
    error: string;
  }>;

  // noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔
  return (
    <main className="flex min-h-[calc(100dvh-90px)] flex-1 items-center px-4 py-16">
      <section className="mx-auto w-full max-w-[424px]" aria-labelledby="signup-title">
        <h1 id="signup-title" className="mb-5 text-[32px] leading-10 font-bold tracking-[-0.04em]">
          회원가입
        </h1>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {fields.map((field) => {
            const inputId = `signup-${field.key}`;
            const descriptionId = `${inputId}-description`;
            const duplicateKey = field.key === "email" || field.key === "nickname"
              ? field.key
              : null;
            const check = duplicateKey ? duplicateCheck[duplicateKey] : null;
            const description = field.error || (field.key === "password"
              ? "영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요."
              : "");

            return (
              <div key={field.key}>
                <label htmlFor={inputId} className="mb-1.5 block text-[13px] leading-5 font-bold">
                  {field.label}
                </label>
                <div
                  className={`flex h-12 items-center overflow-hidden rounded-lg border bg-white transition focus-within:border-[#4f60ee] focus-within:ring-2 focus-within:ring-[#4f60ee]/15 ${field.error ? "border-red-400" : "border-gray-200"}`}
                >
                  <input
                    id={inputId}
                    name={field.key}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    disabled={check?.isChecking}
                    value={form[field.key]}
                    onChange={(event) => handleChangeField(field.key, event.target.value)}
                    placeholder={field.placeholder}
                    aria-invalid={Boolean(field.error)}
                    aria-describedby={description ? descriptionId : undefined}
                    className="h-full min-w-0 flex-1 bg-transparent px-3.5 text-sm outline-none placeholder:text-gray-400"
                  />
                  {field.key === "email" && (
                    <button
                      type="button"
                      disabled={!isEmailValid || duplicateCheck.email.isChecking}
                      onClick={() => handleCheckDuplicate("email")}
                      aria-busy={duplicateCheck.email.isChecking}
                      aria-label="이메일 중복 확인"
                      className="h-full shrink-0 px-3.5 text-xs font-bold text-[#4f60ee] disabled:cursor-not-allowed"
                    >
                      {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
                    </button>
                  )}
                  {field.hasDuplicateCheck && duplicateKey === "nickname" && (
                    <button
                      type="button"
                      disabled={check?.isChecking || !isNicknameValid}
                      onClick={() => void handleCheckDuplicate(duplicateKey)}
                      aria-busy={check?.isChecking}
                      aria-label={`${field.label} 중복 확인`}
                      className="h-full shrink-0 px-3.5 text-xs font-bold text-[#4f60ee] disabled:cursor-not-allowed"
                    >
                      {check?.isChecking ? "확인 중…" : "중복 확인"}
                    </button>
                  )}
                </div>
                {description && (
                  <p
                    id={descriptionId}
                    aria-live="polite"
                    className={`mt-1 text-[11px] leading-4 ${field.error ? "text-red-600" : "text-gray-400"}`}
                  >
                    {description}
                  </p>
                )}
              </div>
            );
          })}

          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            aria-busy={isSubmitting}
            className="h-[46px] w-full rounded-md bg-[#4f60ee] text-sm font-bold text-white transition enabled:cursor-pointer enabled:hover:bg-[#4052de] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f60ee] disabled:cursor-not-allowed"
          >
            {isSubmitting ? "가입 중" : "가입하기"}
          </button>
        </form>

        <p className="mt-4 flex items-center justify-center gap-1 text-xs leading-5 text-gray-500">
          이미 계정이 있나요?
          <Link
            to="/login"
            className="font-bold text-[#4f60ee] hover:underline"
          >
            로그인
          </Link>
        </p>
      </section>
    </main>
  );
}
