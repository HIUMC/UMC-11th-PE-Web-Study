import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import {
  checkDuplicate,
  readMemberApiError,
  signup,
  type DuplicateField,
} from "../../api/members/member-api";
import {
  AccountPanel,
  accountButtonClass,
  accountInputClass,
  accountLinkClass,
} from "../../components/account/account-panel";
import { emptySignupForm, validateSignup, type SignupForm } from "./signup-validation";

type CheckState =
  | { status: "idle" | "checking" | "taken" }
  | { status: "available"; value: string }
  | { status: "error"; message: string };

const idle: CheckState = { status: "idle" };
const emptyChecks: Record<DuplicateField, CheckState> = {
  email: idle,
  nickname: idle,
};

const duplicateFields = [
  { key: "email", label: "이메일", placeholder: "name@example.com" },
  { key: "nickname", label: "닉네임", placeholder: "2~12자" },
] as const;

const passwordFields = [
  { key: "password", label: "비밀번호", placeholder: "영문 대·소문자, 숫자, 특수문자 포함" },
  { key: "passwordConfirm", label: "비밀번호 확인", placeholder: "비밀번호를 한 번 더 입력" },
] as const;

export function SignupPage() {
  const [form, setForm] = useState(emptySignupForm);
  const [checks, setChecks] = useState(emptyChecks);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const errors = validateSignup(form);
  const canSubmit =
    !isSubmitting &&
    Object.values(errors).every((error) => !error) &&
    checks.email.status === "available" &&
    checks.email.value === form.email.trim() &&
    checks.nickname.status === "available" &&
    checks.nickname.value === form.nickname.trim();

  function changeField(key: keyof SignupForm, value: string) {
    if (key === "email" || key === "nickname") {
      setChecks((previous) => ({ ...previous, [key]: idle }));
    }
    setForm((previous) => ({ ...previous, [key]: value }));
    setSubmitError("");
  }

  async function checkField(field: DuplicateField) {
    if (isSubmitting || errors[field] || checks[field].status === "checking") return;

    const value = form[field].trim();
    setChecks((previous) => ({ ...previous, [field]: { status: "checking" } }));

    try {
      const available = await checkDuplicate(field, value);
      setChecks((previous) => ({
        ...previous,
        [field]: available ? { status: "available", value } : { status: "taken" },
      }));
    } catch (error) {
      setChecks((previous) => ({
        ...previous,
        [field]: { status: "error", message: readMemberApiError(error).message },
      }));
    }
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setSubmitError("");
    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });

      setForm(emptySignupForm);
      setChecks(emptyChecks);
      setSuccessMessage(response.message);
    } catch (error) {
      const { status, code, message } = readMemberApiError(error);
      setSubmitError(message);

      if (status === 409) {
        if (code === "MEMBER4091" || code === "MEMBER4092") {
          const field = code === "MEMBER4091" ? "email" : "nickname";
          setChecks((previous) => ({ ...previous, [field]: { status: "taken" } }));
        } else {
          setChecks(emptyChecks);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AccountPanel title="회원가입" description="UMCine에서 영화와 평점을 만나 보세요." icon="person">
      {successMessage ? (
        <div className="space-y-4">
          <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
            {successMessage}
          </p>
          <Link to="/login" className={accountButtonClass + " w-full"}>로그인 화면으로</Link>
        </div>
      ) : (
        <>
          <form noValidate onSubmit={handleSubmit} aria-busy={isSubmitting}>
            <fieldset disabled={isSubmitting} className="space-y-4">
              {duplicateFields.map(({ key, label, placeholder }) => {
                const check = checks[key];
                const validation = form[key] ? errors[key] : "";
                const feedback = validation || (check.status === "available"
                  ? "사용할 수 있어요."
                  : check.status === "taken"
                    ? "이미 사용 중이에요."
                    : check.status === "error" ? check.message : "");
                const invalid = Boolean(validation) || check.status === "taken";

                return (
                  <div key={key}>
                    <label htmlFor={key} className="mb-1.5 block text-sm font-semibold">{label}</label>
                    <div className="flex items-stretch gap-2">
                      <input
                        id={key}
                        type={key === "email" ? "email" : "text"}
                        autoComplete={key === "email" ? "email" : "nickname"}
                        value={form[key]}
                        onChange={(event) => changeField(key, event.target.value)}
                        disabled={check.status === "checking"}
                        placeholder={placeholder}
                        required
                        aria-invalid={invalid}
                        aria-describedby={key + "-feedback"}
                        className={accountInputClass}
                      />
                      <button
                        type="button"
                        disabled={Boolean(errors[key]) || check.status === "checking"}
                        onClick={() => void checkField(key)}
                        aria-label={label + " " + (check.status === "checking" ? "확인 중" : "중복 확인")}
                        className="shrink-0 rounded-lg border border-[#cad3fa] bg-[#f3f5ff] px-3 text-sm font-semibold text-[#344fc4] hover:bg-[#e8edff] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {check.status === "checking" ? "확인 중…" : "중복 확인"}
                      </button>
                    </div>
                    <p id={key + "-feedback"} aria-live="polite" className={"mt-1 text-xs " +
                      (check.status === "available" ? "text-emerald-700" : "text-red-700")}>
                      {feedback}
                    </p>
                  </div>
                );
              })}

              {passwordFields.map(({ key, label, placeholder }) => {
                const validation = form[key] ? errors[key] : "";
                return (
                  <div key={key}>
                    <label htmlFor={key} className="mb-1.5 block text-sm font-semibold">{label}</label>
                    <input
                      id={key}
                      type="password"
                      autoComplete="new-password"
                      value={form[key]}
                      onChange={(event) => changeField(key, event.target.value)}
                      placeholder={placeholder}
                      required
                      aria-invalid={Boolean(validation)}
                      aria-describedby={key + "-feedback"}
                      className={accountInputClass}
                    />
                    <p id={key + "-feedback"} aria-live="polite" className="mt-1 text-xs text-red-700">
                      {validation}
                    </p>
                  </div>
                );
              })}

              {submitError && (
                <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
                  {submitError}
                </p>
              )}

              <button type="submit" disabled={!canSubmit} className={accountButtonClass + " w-full"}>
                {isSubmitting ? "가입 중…" : "가입하기"}
              </button>
            </fieldset>
          </form>

          <p className="mt-5 text-center text-sm text-[#555d6d]">
            이미 계정이 있나요? <Link to="/login" className={accountLinkClass}>로그인</Link>
          </p>
        </>
      )}
    </AccountPanel>
  );
}
