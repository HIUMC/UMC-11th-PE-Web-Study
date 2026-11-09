import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";
import { checkEmail } from "../../api/members/check-email";
import { checkNickname } from "../../api/members/check-nickname";
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

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    isEmailValid && isNicknameValid && isPasswordValid && isPasswordConfirmValid;

  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  function handleChangeField(key: DefaultFormKey, value: string) {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }));
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCheckDuplicate(key: DuplicateCheckKey) {
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
          ? await checkEmail(form.email.trim())
          : await checkNickname(form.nickname.trim());

      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable: response.available },
      }));
      alert(
        response.available
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
      // 로그인 페이지 만든 뒤 주석 해제
      // navigate({ to: "/login" });
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#f5f6f8] pt-28 pb-20">
      <div className="mx-auto w-full max-w-[440px] px-6">
        <h1 className="text-[28px] font-bold text-neutral-900">회원가입</h1>

        <form onSubmit={handleSubmit} noValidate className="mt-7">
          {/* 이메일 */}
          <label htmlFor="email" className="block text-sm font-medium text-neutral-900">
            이메일
          </label>
          <div className="mt-1.5 flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3.5 py-3">
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              disabled={duplicateCheck.email.isChecking}
              onChange={(event) => handleChangeField("email", event.target.value)}
              className="flex-1 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 disabled:bg-transparent"
            />
            <button
              type="button"
              disabled={!isEmailValid || duplicateCheck.email.isChecking}
              onClick={() => handleCheckDuplicate("email")}
              className="shrink-0 cursor-pointer text-sm font-semibold text-blue-600 disabled:cursor-default disabled:text-neutral-300"
            >
              {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showEmailError && (
            <p className="mt-1.5 text-xs text-red-600">올바른 이메일 형식이 아니에요.</p>
          )}

          {/* 닉네임 */}
          <label htmlFor="nickname" className="mt-5 block text-sm font-medium text-neutral-900">
            닉네임
          </label>
          <div className="mt-1.5 flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3.5 py-3">
            <input
              id="nickname"
              type="text"
              placeholder="2–12자"
              value={form.nickname}
              disabled={duplicateCheck.nickname.isChecking}
              onChange={(event) => handleChangeField("nickname", event.target.value)}
              className="flex-1 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 disabled:bg-transparent"
            />
            <button
              type="button"
              disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
              onClick={() => handleCheckDuplicate("nickname")}
              className="shrink-0 cursor-pointer text-sm font-semibold text-blue-600 disabled:cursor-default disabled:text-neutral-300"
            >
              {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showNicknameError && (
            <p className="mt-1.5 text-xs text-red-600">닉네임은 2–12자로 입력해 주세요.</p>
          )}

          {/* 비밀번호 */}
          <label htmlFor="password" className="mt-5 block text-sm font-medium text-neutral-900">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            placeholder="8자 이상"
            value={form.password}
            onChange={(event) => handleChangeField("password", event.target.value)}
            className="mt-1.5 w-full rounded-md border border-neutral-200 bg-white px-3.5 py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
          />
          {showPasswordError && (
            <p className="mt-1.5 text-xs text-red-600">
              영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요.
            </p>
          )}

          {/* 비밀번호 확인 */}
          <label
            htmlFor="passwordConfirm"
            className="mt-5 block text-sm font-medium text-neutral-900"
          >
            비밀번호 확인
          </label>
          <input
            id="passwordConfirm"
            type="password"
            placeholder="다시 입력"
            value={form.passwordConfirm}
            onChange={(event) => handleChangeField("passwordConfirm", event.target.value)}
            className="mt-1.5 w-full rounded-md border border-neutral-200 bg-white px-3.5 py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
          />
          {showPasswordConfirmError && (
            <p className="mt-1.5 text-xs text-red-600">비밀번호가 일치하지 않아요.</p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="mt-7 w-full cursor-pointer rounded-md bg-blue-600 py-3.5 text-sm font-semibold text-white disabled:cursor-default disabled:bg-neutral-300"
          >
            {isSubmitting ? "가입 중" : "가입하기"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-neutral-500">
          이미 계정이 있나요?{" "}
          <Link to="/login" className="font-semibold text-blue-600">
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}