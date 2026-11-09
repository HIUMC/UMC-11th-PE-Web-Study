import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
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

type DuplicateCheckKey = "email" | "nickname";

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];

const inputClassName =
  "h-12 w-full rounded-lg border border-[#DCE1E8] bg-white px-4 text-sm text-[#191D23] outline-none transition placeholder:text-[#A7ADB7] focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED]";

export function SignupPage() {
  const navigate = useNavigate();
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
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await navigate({ to: "/" });
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen justify-center bg-[#F7F8FA] px-5 py-16 sm:items-center sm:py-20">
      <section className="w-full max-w-[400px]">
        <h1 className="mb-5 text-[30px] font-bold tracking-[-0.04em] text-[#191D23]">회원가입</h1>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#191D23]">이메일</label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) => handleChangeField("email", event.target.value)}
                disabled={duplicateCheck.email.isChecking}
                placeholder="name@example.com"
                autoComplete="email"
                aria-invalid={showEmailError}
                aria-describedby={showEmailError ? "email-error" : undefined}
                className={`${inputClassName} pr-24`}
              />
              <button
                type="button"
                onClick={() => handleCheckDuplicate("email")}
                disabled={!isEmailValid || duplicateCheck.email.isChecking}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#2F6FED] hover:underline disabled:cursor-not-allowed disabled:text-[#A7ADB7] disabled:no-underline"
              >
                {duplicateCheck.email.isChecking ? "확인 중..." : "중복 확인"}
              </button>
            </div>
            {showEmailError && <p id="email-error" role="alert" className="mt-1.5 text-xs text-[#D14343]">이메일 형식을 확인해주세요.</p>}
          </div>

          <div>
            <label htmlFor="nickname" className="mb-2 block text-sm font-semibold text-[#191D23]">닉네임</label>
            <div className="relative">
              <input
                id="nickname"
                type="text"
                value={form.nickname}
                onChange={(event) => handleChangeField("nickname", event.target.value)}
                disabled={duplicateCheck.nickname.isChecking}
                placeholder="2–12자"
                autoComplete="nickname"
                maxLength={12}
                aria-invalid={showNicknameError}
                aria-describedby={showNicknameError ? "nickname-error" : undefined}
                className={`${inputClassName} pr-24`}
              />
              <button
                type="button"
                onClick={() => handleCheckDuplicate("nickname")}
                disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#2F6FED] hover:underline disabled:cursor-not-allowed disabled:text-[#A7ADB7] disabled:no-underline"
              >
                {duplicateCheck.nickname.isChecking ? "확인 중..." : "중복 확인"}
              </button>
            </div>
            {showNicknameError && <p id="nickname-error" role="alert" className="mt-1.5 text-xs text-[#D14343]">닉네임은 2~12자로 입력해 주세요.</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#191D23]">비밀번호</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(event) => handleChangeField("password", event.target.value)}
              placeholder="8자 이상"
              autoComplete="new-password"
              aria-invalid={showPasswordError}
              aria-describedby="password-help"
              className={inputClassName}
            />
            <p id="password-help" className={`mt-1.5 text-[11px] ${showPasswordError ? "text-[#D14343]" : "text-[#9CA3AF]"}`}>영문 대소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요.</p>
          </div>

          <div>
            <label htmlFor="password-confirm" className="mb-2 block text-sm font-semibold text-[#191D23]">비밀번호 확인</label>
            <input
              id="password-confirm"
              type="password"
              value={form.passwordConfirm}
              onChange={(event) => handleChangeField("passwordConfirm", event.target.value)}
              placeholder="다시 입력"
              autoComplete="new-password"
              aria-invalid={showPasswordConfirmError}
              aria-describedby={showPasswordConfirmError ? "password-confirm-error" : undefined}
              className={inputClassName}
            />
            {showPasswordConfirmError && <p id="password-confirm-error" role="alert" className="mt-1.5 text-xs text-[#D14343]">비밀번호를 다시  한 번 확인해주세요.</p>}
          </div>

          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="h-12 w-full rounded-lg bg-[#2F6FED] text-sm font-bold text-white transition hover:bg-[#245DCD] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "가입 중..." : "가입하기"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-[#8A929E]">
          이미 계정이 있나요?{" "}
          <Link to="/" className="font-bold text-[#2F6FED] hover:underline">로그인</Link>
        </p>
      </section>
    </main>
  );
}
