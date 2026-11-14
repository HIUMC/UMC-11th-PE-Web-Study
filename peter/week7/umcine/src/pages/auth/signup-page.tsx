import { useState } from "react";
import { checkEmailDuplicate } from "@/api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "@/api/members/check-nickname-duplicate";
import { signup } from "@/api/members/signup";
import { Link } from "@tanstack/react-router";
// import { useNavigate } from "@tanstack/react-router";

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
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // 모든 입력값이 유효하면 제출 버튼 활성화
  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
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

  // noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔
  return (
    <main className="min-h-[calc(100vh-148px)] bg-[#f6f7f9] px-4 pt-16 pb-20 sm:pt-[216px]">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto w-full max-w-[430px]"
      >
        <h1 className="mb-5 text-[32px] leading-[38px] font-extrabold tracking-tight text-[#17191e]">
          회원가입
        </h1>
        {/* 이메일 작성 */}
        <div className="mb-4 flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-extrabold text-[#17191e]">
            이메일
          </label>
          <div className="flex h-12 items-center gap-3 rounded-lg border border-[#e3e6eb] bg-white px-4 focus-within:ring-2 focus-within:ring-[#2563eb]">
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={form.email}
              disabled={duplicateCheck.email.isChecking}
              onChange={(e) => handleChangeField("email", e.target.value)}
              aria-invalid={showEmailError}
              aria-describedby={showEmailError ? "email-error" : undefined}
              className="min-w-0 flex-1 bg-transparent text-sm text-[#17191e] outline-none placeholder:text-[#969da8]"
            />
            <button
              type="button"
              disabled={!isEmailValid || duplicateCheck.email.isChecking}
              onClick={() => handleCheckDuplicate("email")}
              className="shrink-0 text-xs font-extrabold text-[#2563eb] enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showEmailError && (
            <p id="email-error" className="text-xs text-red-600">
              올바른 이메일 형식을 입력해주세요.
            </p>
          )}
          {duplicateCheck.email.isAvailable && (
            <p role="status" className="text-xs text-green-600">
              사용할 수 있는 이메일이에요.
            </p>
          )}
        </div>

        {/* 닉네임 설정 */}
        <div className="mb-4 flex flex-col gap-2">
          <label htmlFor="nickname" className="text-sm font-extrabold text-[#17191e]">
            닉네임
          </label>
          <div className="flex h-12 items-center gap-3 rounded-lg border border-[#e3e6eb] bg-white px-4 focus-within:ring-2 focus-within:ring-[#2563eb]">
            <input
              id="nickname"
              type="text"
              autoComplete="nickname"
              placeholder="2-12자"
              value={form.nickname}
              disabled={duplicateCheck.nickname.isChecking}
              onChange={(e) => handleChangeField("nickname", e.target.value)}
              aria-invalid={showNicknameError}
              aria-describedby={showNicknameError ? "nickname-error" : undefined}
              className="min-w-0 flex-1 bg-transparent text-sm text-[#17191e] outline-none placeholder:text-[#969da8]"
            />
            <button
              type="button"
              disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
              onClick={() => handleCheckDuplicate("nickname")}
              className="shrink-0 text-xs font-extrabold text-[#2563eb] enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showNicknameError && (
            <p id="nickname-error" className="text-xs text-red-600">
              닉네임은 2~12자로 입력해주세요.
            </p>
          )}
          {duplicateCheck.nickname.isAvailable && (
            <p role="status" className="text-xs text-green-600">
              사용할 수 있는 닉네임이에요.
            </p>
          )}
        </div>

        {/* 비밀번호 작성 */}
        <div className="mb-4 flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-extrabold text-[#17191e]">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="8자 이상"
            value={form.password}
            onChange={(e) => handleChangeField("password", e.target.value)}
            aria-invalid={showPasswordError}
            aria-describedby="password-help"
            className="h-12 w-full rounded-lg border border-[#e3e6eb] bg-white px-4 text-sm text-[#17191e] outline-none placeholder:text-[#969da8] focus:ring-2 focus:ring-[#2563eb]"
          />
          <p
            id="password-help"
            className={showPasswordError ? "text-xs text-red-600" : "text-xs text-[#969da8]"}
          >
            영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해주세요.
          </p>
        </div>

        {/* 비밀번호 입력 확인 */}
        <div className="mb-4 flex flex-col gap-2">
          <label htmlFor="passwordConfirm" className="text-sm font-extrabold text-[#17191e]">
            비밀번호 확인
          </label>
          <input
            id="passwordConfirm"
            type="password"
            autoComplete="new-password"
            placeholder="다시 입력"
            value={form.passwordConfirm}
            onChange={(e) => handleChangeField("passwordConfirm", e.target.value)}
            aria-invalid={showPasswordConfirmError}
            aria-describedby={showPasswordConfirmError ? "password-confirm-error" : undefined}
            className="h-12 w-full rounded-lg border border-[#e3e6eb] bg-white px-4 text-sm text-[#17191e] outline-none placeholder:text-[#969da8] focus:ring-2 focus:ring-[#2563eb]"
          />
          {showPasswordConfirmError && (
            <p id="password-confirm-error" className="text-xs text-red-600">
              비밀번호가 일치하지 않습니다.
            </p>
          )}
        </div>

        {/* 입력 조건과 이메일·닉네임 중복 확인을 모두 통과하면 가입 버튼 활성화 */}
        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="h-12 w-full rounded-lg bg-[#2563eb] text-sm font-extrabold text-white enabled:cursor-pointer enabled:hover:bg-blue-700 enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-20"
        >
          {isSubmitting ? "가입중" : "가입하기"}
        </button>
          {/*auth-footer*/}
          <p className="mt-4 flex items-center justify-center gap-1 text-xs text-[#606774]">
            이미 계정이 있나요?
            <Link
              to="/login"
              className="font-extrabold text-[#2563eb] hover:underline"
            >
              로그인
            </Link>
          </p>
      </form>
    </main>
  )
}
