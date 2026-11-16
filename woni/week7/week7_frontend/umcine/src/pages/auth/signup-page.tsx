import { Link } from "@tanstack/react-router";
import { signup } from "@/api/members/signup";
import { useState } from "react";
// [3.3] 중복 확인 요청 함수
import { checkEmailDuplicate } from "@/api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "@/api/members/check-nickname-duplicate";

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

// [3.3] 중복 확인 상태의 기본값
const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];
// [3.3]
type DuplicateCheckKey = "email" | "nickname";

// 공통 스타일
const LABEL_CLASS = "text-[13px] font-extrabold text-[#17191e]";
const INPUT_CLASS =
  "min-w-0 flex-1 bg-transparent px-0.5 py-px text-sm text-[#17191e] outline-none placeholder:text-[#969da8]";
const TEXT_LINK_CLASS =
  "shrink-0 text-xs font-extrabold text-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50";
const ERROR_CLASS = "text-[11px] text-[#e5484d]";

const getFieldBoxClass = (hasError: boolean) =>
  `flex min-h-12 items-center gap-[9px] rounded-lg border bg-white px-[13px] py-[14px] ${
    hasError
      ? "border-[#e5484d]"
      : "border-[#e3e6eb] focus-within:border-[#2563eb]"
  }`;

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  // [3.3] 이메일과 닉네임의 중복 확인 상태
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });
  // [3.4] 회원가입 요청 중 여부
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

  // 모든 입력값이 유효하면 true
  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  // [3.3] 입력 조건과 두 중복 확인을 모두 통과해야 제출 가능
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  // [3.3] 교체: 확인한 값을 바꾸면 다시 중복 확인해야 함
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

  // [3.3] 추가: 중복 확인 요청
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

  // [3.4] 교체: 회원가입 요청
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
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
      // 로그인 페이지 연결 후 이동 처리 추가
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-148px)] items-center justify-center bg-[#f6f7f9]">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-[430px] max-w-full flex-col gap-4"
      >
        <h1 className="text-[34px] font-bold tracking-[-1.53px] text-[#17191e]">
          회원가입
        </h1>

        <div className="flex flex-col gap-2">
          <label htmlFor="signup-email" className={LABEL_CLASS}>
            이메일
          </label>
          <div className={getFieldBoxClass(showEmailError)}>
            <input
              id="signup-email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => handleChangeField("email", e.target.value)}
              disabled={duplicateCheck.email.isChecking}
              aria-invalid={showEmailError}
              aria-describedby={
                showEmailError ? "signup-email-error" : undefined
              }
              className={INPUT_CLASS}
            />
            <button
              type="button"
              disabled={!isEmailValid || duplicateCheck.email.isChecking}
              onClick={() => handleCheckDuplicate("email")}
              className={TEXT_LINK_CLASS}
            >
              {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showEmailError && (
            <p id="signup-email-error" className={ERROR_CLASS}>
              이메일 형식을 확인해 주세요.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="signup-nickname" className={LABEL_CLASS}>
            닉네임
          </label>
          <div className={getFieldBoxClass(showNicknameError)}>
            <input
              id="signup-nickname"
              type="text"
              placeholder="2-12자"
              value={form.nickname}
              onChange={(e) => handleChangeField("nickname", e.target.value)}
              disabled={duplicateCheck.nickname.isChecking}
              aria-invalid={showNicknameError}
              aria-describedby={
                showNicknameError ? "signup-nickname-error" : undefined
              }
              className={INPUT_CLASS}
            />
            <button
              type="button"
              disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
              onClick={() => handleCheckDuplicate("nickname")}
              className={TEXT_LINK_CLASS}
            >
              {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showNicknameError && (
            <p id="signup-nickname-error" className={ERROR_CLASS}>
              닉네임은 2자 이상 12자 이하로 입력해 주세요.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-2">
            <label htmlFor="signup-password" className={LABEL_CLASS}>
              비밀번호
            </label>
            <div className={getFieldBoxClass(showPasswordError)}>
              <input
                id="signup-password"
                type="password"
                placeholder="8자 이상"
                value={form.password}
                onChange={(e) => handleChangeField("password", e.target.value)}
                aria-invalid={showPasswordError}
                aria-describedby="signup-password-hint"
                className={INPUT_CLASS}
              />
            </div>
          </div>
          <p
            id="signup-password-hint"
            className={`text-[11px] ${
              showPasswordError ? "text-[#e5484d]" : "text-[#969da8]"
            }`}
          >
            영문 대소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="signup-password-confirm" className={LABEL_CLASS}>
            비밀번호 확인
          </label>
          <div className={getFieldBoxClass(showPasswordConfirmError)}>
            <input
              id="signup-password-confirm"
              type="password"
              placeholder="다시 입력"
              value={form.passwordConfirm}
              onChange={(e) =>
                handleChangeField("passwordConfirm", e.target.value)
              }
              aria-invalid={showPasswordConfirmError}
              aria-describedby={
                showPasswordConfirmError
                  ? "signup-password-confirm-error"
                  : undefined
              }
              className={INPUT_CLASS}
            />
          </div>
          {showPasswordConfirmError && (
            <p id="signup-password-confirm-error" className={ERROR_CLASS}>
              비밀번호가 일치하지 않아요.
            </p>
          )}
        </div>

        {/* [3.3] 조건: !isFormValid -> !canSubmit */}

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="h-12 w-full rounded-lg bg-[#2563eb] px-4 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>

        <div className="flex items-end justify-center">
          <p className="text-[13px] text-[#606774]">
            이미 계정이 있나요?&nbsp;
          </p>
          <Link to="/login" className={TEXT_LINK_CLASS}>
            로그인
          </Link>
        </div>
      </form>
    </main>
  );
}
