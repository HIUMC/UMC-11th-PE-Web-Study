import { useState } from "react";
import { checkEmailDuplicate } from "@/api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "@/api/members/check-nickname-duplicate";
import { signup } from "@/api/members/signup";
import { Link, useNavigate } from "@tanstack/react-router";

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

const inputClass =
  "h-12 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-600 disabled:bg-gray-50";
const labelClass = "mb-2 block text-sm font-bold text-gray-900";
const errorClass = "mt-1.5 text-xs text-red-500";
const checkButtonClass =
  "absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-600 disabled:text-gray-300";

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // 입력값 유효성 검사
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

  const isFormValid =
    isEmailValid && isNicknameValid && isPasswordValid && isPasswordConfirmValid;

  // 입력 조건과 두 중복 확인을 모두 통과해야 제출 가능
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: DefaultFormKey, value: string) => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      navigate({ to: "/login" });
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-90px)] items-center justify-center bg-gray-100 px-4 py-16">
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-[430px]">
        <h1 className="mb-6 text-3xl font-extrabold text-gray-900">회원가입</h1>

        {/* 이메일 */}
        <div className="mb-5">
          <label className={labelClass}>이메일</label>
          <div className="relative">
            <input
              type="email"
              placeholder="name@example.com"
              className={`${inputClass} pr-24`}
              value={form.email}
              disabled={duplicateCheck.email.isChecking}
              onChange={(e) => handleChangeField("email", e.target.value)}
            />
            <button
              type="button"
              disabled={!isEmailValid || duplicateCheck.email.isChecking}
              onClick={() => handleCheckDuplicate("email")}
              className={checkButtonClass}
            >
              {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showEmailError && (
            <p className={errorClass}>올바른 이메일 형식이 아니에요.</p>
          )}
        </div>

        {/* 닉네임 */}
        <div className="mb-5">
          <label className={labelClass}>닉네임</label>
          <div className="relative">
            <input
              type="text"
              placeholder="2–12자"
              className={`${inputClass} pr-24`}
              value={form.nickname}
              disabled={duplicateCheck.nickname.isChecking}
              onChange={(e) => handleChangeField("nickname", e.target.value)}
            />
            <button
              type="button"
              disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
              onClick={() => handleCheckDuplicate("nickname")}
              className={checkButtonClass}
            >
              {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showNicknameError && (
            <p className={errorClass}>
              닉네임은 2자 이상 12자 이하로 입력해 주세요.
            </p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="mb-5">
          <label className={labelClass}>비밀번호</label>
          <input
            type="password"
            placeholder="8자 이상"
            className={inputClass}
            value={form.password}
            onChange={(e) => handleChangeField("password", e.target.value)}
          />
          <p
            className={`mt-1.5 text-xs ${
              showPasswordError ? "text-red-500" : "text-gray-400"
            }`}
          >
            영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요
          </p>
        </div>

        {/* 비밀번호 확인 */}
        <div className="mb-6">
          <label className={labelClass}>비밀번호 확인</label>
          <input
            type="password"
            placeholder="다시 입력"
            className={inputClass}
            value={form.passwordConfirm}
            onChange={(e) => handleChangeField("passwordConfirm", e.target.value)}
          />
          {showPasswordConfirmError && (
            <p className={errorClass}>비밀번호가 일치하지 않아요.</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="h-12 w-full rounded-lg bg-blue-600 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>

        <p className="mt-5 text-center text-xs text-gray-600">
          이미 계정이 있나요?{" "}
          <Link to="/login" className="font-bold text-blue-600">
            로그인
          </Link>
        </p>
      </form>
    </main>
  );
}