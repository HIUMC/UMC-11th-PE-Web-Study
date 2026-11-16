import { useState } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";

import { useNavigate } from "@tanstack/react-router";

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

  // 입력 조건과 두 중복 확인을 모두 통과해야 제출 가능
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 다시 중복 확인해야 함
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
      navigate({ to: "/login" });
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔
  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#f6f7f9] py-12">
      <form
        className="flex flex-col w-[430px] items-start gap-4 max-w-[calc(100%-32px)]"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* 타이틀 */}
        <div className="flex flex-col items-start self-stretch w-full">
          <h1 className="text-[34px] font-bold tracking-[-1.53px] leading-normal text-[#17191e]">
            회원가입
          </h1>
        </div>

        {/* 1. 이메일 */}
        <div className="flex flex-col items-start gap-2 self-stretch w-full">
          <div className="flex flex-col items-start gap-2 self-stretch w-full">
            <label
              htmlFor="email"
              className="text-[13px] font-extrabold text-[#17191e] leading-normal"
            >
              이메일
            </label>
            <div
              className={`min-h-12 gap-[9px] px-[13px] py-3.5 bg-white rounded-lg border ${
                showEmailError ? "border-[#d92d20]" : "border-[#e3e6eb]"
              } border-solid flex items-center self-stretch w-full`}
            >
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                placeholder="name@example.com"
                autoComplete="email"
                disabled={duplicateCheck.email.isChecking}
                aria-invalid={showEmailError}
                onChange={(e) => handleChangeField("email", e.target.value)}
                className="flex-1 w-full bg-transparent border-0 outline-none text-sm font-normal text-[#17191e] placeholder:text-[#969da8] disabled:opacity-50"
              />
              <button
                type="button"
                disabled={!isEmailValid || duplicateCheck.email.isChecking}
                onClick={() => handleCheckDuplicate("email")}
                aria-label="이메일 중복 확인"
                className="inline-flex items-center justify-center shrink-0 bg-transparent border-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="font-extrabold text-[#2563eb] text-xs whitespace-nowrap">
                  {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
                </span>
              </button>
            </div>
          </div>
          {showEmailError && (
            <p className="text-[11px] font-normal text-[#d92d20]" role="alert">
              올바른 이메일 형식을 입력해 주세요
            </p>
          )}
        </div>

        {/* 2. 닉네임 */}
        <div className="flex flex-col items-start gap-2 self-stretch w-full">
          <div className="flex flex-col items-start gap-2 self-stretch w-full">
            <label
              htmlFor="nickname"
              className="text-[13px] font-extrabold text-[#17191e] leading-normal"
            >
              닉네임
            </label>
            <div
              className={`min-h-12 gap-[9px] px-[13px] py-3.5 bg-white rounded-lg border ${
                showNicknameError ? "border-[#d92d20]" : "border-[#e3e6eb]"
              } border-solid flex items-center self-stretch w-full`}
            >
              <input
                id="nickname"
                name="nickname"
                type="text"
                value={form.nickname}
                placeholder="2–12자"
                autoComplete="nickname"
                disabled={duplicateCheck.nickname.isChecking}
                aria-invalid={showNicknameError}
                onChange={(e) => handleChangeField("nickname", e.target.value)}
                className="flex-1 w-full bg-transparent border-0 outline-none text-sm font-normal text-[#17191e] placeholder:text-[#969da8] disabled:opacity-50"
              />
              <button
                type="button"
                disabled={
                  !isNicknameValid || duplicateCheck.nickname.isChecking
                }
                onClick={() => handleCheckDuplicate("nickname")}
                aria-label="닉네임 중복 확인"
                className="inline-flex items-center justify-center shrink-0 bg-transparent border-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="font-extrabold text-[#2563eb] text-xs whitespace-nowrap">
                  {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
                </span>
              </button>
            </div>
          </div>
          {showNicknameError && (
            <p className="text-[11px] font-normal text-[#d92d20]" role="alert">
              닉네임은 2–12자로 입력해 주세요
            </p>
          )}
        </div>

        {/* 3. 비밀번호 */}
        <div className="flex flex-col items-start gap-1 self-stretch w-full">
          <div className="flex flex-col items-start gap-2 self-stretch w-full">
            <label
              htmlFor="password"
              className="text-[13px] font-extrabold text-[#17191e] leading-normal"
            >
              비밀번호
            </label>
            <div
              className={`min-h-12 px-[13px] py-3.5 bg-white rounded-lg border ${
                showPasswordError ? "border-[#d92d20]" : "border-[#e3e6eb]"
              } border-solid flex items-center self-stretch w-full`}
            >
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                placeholder="8자 이상"
                autoComplete="new-password"
                aria-invalid={showPasswordError}
                aria-describedby="password-help"
                onChange={(e) => handleChangeField("password", e.target.value)}
                className="flex-1 w-full bg-transparent border-0 outline-none text-sm font-normal text-[#17191e] placeholder:text-[#969da8]"
              />
            </div>
          </div>
          <p
            id="password-help"
            role={showPasswordError ? "alert" : undefined}
            className={`text-[11px] font-normal leading-normal ${
              showPasswordError ? "text-[#d92d20]" : "text-[#969da8]"
            }`}
          >
            영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요
          </p>
        </div>

        {/* 4. 비밀번호 확인 */}
        <div className="flex flex-col items-start gap-2 self-stretch w-full">
          <div className="flex flex-col items-start gap-2 self-stretch w-full">
            <label
              htmlFor="passwordConfirm"
              className="text-[13px] font-extrabold text-[#17191e] leading-normal"
            >
              비밀번호 확인
            </label>
            <div
              className={`min-h-12 px-[13px] py-3.5 bg-white rounded-lg border ${
                showPasswordConfirmError
                  ? "border-[#d92d20]"
                  : "border-[#e3e6eb]"
              } border-solid flex items-center self-stretch w-full`}
            >
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                value={form.passwordConfirm}
                placeholder="다시 입력"
                autoComplete="new-password"
                aria-invalid={showPasswordConfirmError}
                onChange={(e) =>
                  handleChangeField("passwordConfirm", e.target.value)
                }
                className="flex-1 w-full bg-transparent border-0 outline-none text-sm font-normal text-[#17191e] placeholder:text-[#969da8]"
              />
            </div>
          </div>
          {showPasswordConfirmError && (
            <p className="text-[11px] font-normal text-[#d92d20]" role="alert">
              비밀번호가 일치하지 않습니다
            </p>
          )}
        </div>

        {/* 가입하기 버튼 */}
        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="flex h-12 items-center justify-center px-4 py-0 self-stretch w-full bg-[#2563eb] rounded-lg border-0 enabled:hover:bg-[#1d4ed8] enabled:active:bg-[#1748ad] disabled:bg-[#d9e5ff] disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <span className="font-extrabold text-white text-sm text-center">
            {isSubmitting ? "가입 중" : "가입하기"}
          </span>
        </button>

        {/* 하단 로그인 링크 */}
        <div className="flex items-center justify-center gap-1 self-stretch w-full">
          <span className="font-normal text-[#606774] text-[13px]">
            이미 계정이 있나요?
          </span>
          <a href="/login" className="inline-flex items-center justify-center">
            <span className="font-extrabold text-[#2563eb] text-xs whitespace-nowrap">
              로그인
            </span>
          </a>
        </div>
      </form>
    </main>
  );
}
