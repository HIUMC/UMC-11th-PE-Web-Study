import { Link } from "@tanstack/react-router";
import { useRef, useState, type SubmitEvent } from "react";
import { HTTPError } from "ky";
import { getMemberErrorMessage } from "../../api/api-client";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";
import { FormField, primaryButtonClass } from "../../components/auth/form-field";
import { DEFAULT_SIGNUP_FORM, validateSignupForm, type SignupForm } from "../../utils/auth-validation";

type DuplicateKey = "email" | "nickname";
const DEFAULT_CHECK = { isChecking: false, isAvailable: false, value: "", message: "" };
const fieldErrors = {
  email: "올바른 이메일 형식으로 입력해 주세요.",
  nickname: "닉네임은 2~12자로 입력해 주세요.",
  password: "영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상 입력해 주세요.",
  passwordConfirm: "비밀번호가 일치하지 않아요.",
};

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_SIGNUP_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({ email: DEFAULT_CHECK, nickname: DEFAULT_CHECK });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ success: false, message: "" });
  const busy = useRef({ email: false, nickname: false, submit: false });
  const valid = validateSignupForm(form);
  const canSubmit = Object.values(valid).every(Boolean) &&
    duplicateCheck.email.isAvailable && duplicateCheck.email.value === form.email.trim() &&
    duplicateCheck.nickname.isAvailable && duplicateCheck.nickname.value === form.nickname.trim();

  function handleChangeField(key: keyof SignupForm, value: string) {
    if (busy.current.submit || (key === "email" || key === "nickname") && busy.current[key]) return;
    if (key === "email" || key === "nickname") {
      setDuplicateCheck(previous => ({ ...previous, [key]: DEFAULT_CHECK }));
    }
    setFeedback({ success: false, message: "" });
    setForm(previous => ({ ...previous, [key]: value }));
  }

  async function handleCheckDuplicate(key: DuplicateKey) {
    if (!valid[key] || busy.current[key] || busy.current.submit) return;
    busy.current[key] = true;
    const value = form[key].trim();
    const label = key === "email" ? "이메일" : "닉네임";
    setDuplicateCheck(previous => ({ ...previous, [key]: { ...DEFAULT_CHECK, isChecking: true } }));
    try {
      const response = key === "email" ? await checkEmailDuplicate(value) : await checkNicknameDuplicate(value);
      setDuplicateCheck(previous => ({ ...previous, [key]: {
        isChecking: false, isAvailable: response.available, value,
        message: response.available ? `사용할 수 있는 ${label}이에요.` : `이미 사용 중인 ${label}이에요.`,
      } }));
    } catch (error) {
      setDuplicateCheck(previous => ({ ...previous, [key]: {
        ...DEFAULT_CHECK, message: getMemberErrorMessage(error, "중복 확인에 실패했어요. 다시 시도해 주세요."),
      } }));
    } finally {
      busy.current[key] = false;
    }
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || busy.current.submit || feedback.success) return;
    busy.current.submit = true;
    setIsSubmitting(true);
    setFeedback({ success: false, message: "" });
    try {
      const response = await signup({ email: form.email, nickname: form.nickname, password: form.password });
      setFeedback({ success: true, message: response.message });
      setForm(previous => ({ ...previous, password: "", passwordConfirm: "" }));
    } catch (error) {
      setFeedback({ success: false, message: getMemberErrorMessage(error, "회원가입에 실패했어요. 다시 시도해 주세요.") });
      if (error instanceof HTTPError && error.response.status === 409) {
        setDuplicateCheck({ email: DEFAULT_CHECK, nickname: DEFAULT_CHECK });
      }
    } finally {
      busy.current.submit = false;
      setIsSubmitting(false);
    }
  }

  function duplicateAction(key: DuplicateKey) {
    return <button type="button" aria-label={`${key === "email" ? "이메일" : "닉네임"} 중복 확인`}
      className="mr-3 shrink-0 rounded px-1 py-2 text-xs font-bold text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-300 disabled:text-slate-400"
      disabled={!valid[key] || duplicateCheck[key].isChecking || isSubmitting || feedback.success}
      onClick={() => { void handleCheckDuplicate(key); }}>
      {duplicateCheck[key].isChecking ? "확인 중" : "중복 확인"}
    </button>;
  }

  function duplicateMessage(key: DuplicateKey) {
    const check = duplicateCheck[key];
    return check.message && <p role="status" className={`mt-2 text-xs ${check.isAvailable ? "text-green-700" : "text-red-600"}`}>{check.message}</p>;
  }

  const errorFor = (key: keyof SignupForm) => form[key].length > 0 && !valid[key] ? fieldErrors[key] : undefined;

  return (
    <main className="flex flex-1 justify-center px-4 py-12 sm:py-20">
      <section className="w-full max-w-108" aria-labelledby="signup-title">
        <h1 id="signup-title" className="mb-8 text-3xl font-extrabold tracking-tight">회원가입</h1>
        <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
          <fieldset disabled={isSubmitting || feedback.success} className="space-y-5">
            <legend className="sr-only">회원가입 정보</legend>
            <div>
              <FormField id="signup-email" label="이메일" name="email" type="email" autoComplete="email" maxLength={254}
                placeholder="name@example.com" value={form.email} error={errorFor("email")}
                disabled={duplicateCheck.email.isChecking || isSubmitting || feedback.success}
                onChange={event => handleChangeField("email", event.target.value)} action={duplicateAction("email")} />
              {duplicateMessage("email")}
            </div>
            <div>
              <FormField id="signup-nickname" label="닉네임" name="nickname" autoComplete="nickname" placeholder="2~12자"
                value={form.nickname} error={errorFor("nickname")}
                disabled={duplicateCheck.nickname.isChecking || isSubmitting || feedback.success}
                onChange={event => handleChangeField("nickname", event.target.value)} action={duplicateAction("nickname")} />
              {duplicateMessage("nickname")}
            </div>
            <FormField id="signup-password" label="비밀번호" name="password" type="password" autoComplete="new-password"
              placeholder="8자 이상" value={form.password} error={errorFor("password")} hint={fieldErrors.password}
              onChange={event => handleChangeField("password", event.target.value)} />
            <FormField id="signup-password-confirm" label="비밀번호 확인" name="passwordConfirm" type="password" autoComplete="new-password"
              placeholder="다시 입력" value={form.passwordConfirm} error={errorFor("passwordConfirm")}
              onChange={event => handleChangeField("passwordConfirm", event.target.value)} />
            <button type="submit" className={primaryButtonClass} disabled={!canSubmit || isSubmitting || feedback.success}>
              {isSubmitting ? "가입 중" : "가입하기"}
            </button>
          </fieldset>
        </form>
        {feedback.message && <div role={feedback.success ? "status" : "alert"} className={`mt-5 rounded-lg border p-4 text-sm leading-6 ${feedback.success ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-700"}`}>
          <p>{feedback.message}</p>
          {feedback.success && <Link to="/login" className="mt-2 inline-block font-bold underline">로그인 화면으로 이동</Link>}
        </div>}
        <p className="mt-6 text-center text-sm text-slate-500">이미 계정이 있나요? <Link to="/login" className="font-bold text-blue-600 underline">로그인</Link></p>
      </section>
    </main>
  );
}
