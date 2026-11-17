import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode, type SubmitEvent } from "react";
import { signUpMutationOptions } from "../../api/member-queries";
import { checkEmail, checkNickname } from "../../api/members-api";
import { getServerErrorMessage } from "../../api/request-error";
import { cn } from "../../utils/cn";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

type CheckStatus = "idle" | "checking" | "available" | "taken" | "error";

interface CheckState {
  value: string;
  status: CheckStatus;
  message: string;
}

const IDLE_CHECK: CheckState = { value: "", status: "idle", message: "" };

function validateEmail(email: string) {
  return EMAIL_REGEX.test(email) ? null : "올바른 이메일 형식이 아니에요.";
}

function validateNickname(nickname: string) {
  return nickname.length >= 2 && nickname.length <= 12
    ? null
    : "닉네임은 2~12자로 입력해 주세요.";
}

export function SignUpPage() {
  const navigate = useNavigate();
  const signUpMutation = useMutation(signUpMutationOptions());
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [emailCheck, setEmailCheck] = useState<CheckState>(IDLE_CHECK);
  const [nicknameCheck, setNicknameCheck] = useState<CheckState>(IDLE_CHECK);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const trimmedEmail = email.trim();
  const trimmedNickname = nickname.trim();
  const isEmailChecked =
    emailCheck.status === "available" && emailCheck.value === trimmedEmail;
  const isNicknameChecked =
    nicknameCheck.status === "available" &&
    nicknameCheck.value === trimmedNickname;
  const passwordError =
    password && !PASSWORD_REGEX.test(password)
      ? "영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요."
      : null;
  const passwordConfirmError =
    passwordConfirm && passwordConfirm !== password
      ? "비밀번호가 일치하지 않아요."
      : null;

  async function runCheck(
    value: string,
    validate: (value: string) => string | null,
    request: (value: string) => Promise<{ available: boolean }>,
    label: string,
    setCheck: (state: CheckState) => void,
  ) {
    setSubmitError(null);
    const error = validate(value);
    if (error) {
      setCheck({ value, status: "error", message: error });
      return;
    }
    setCheck({ value, status: "checking", message: "" });
    try {
      const { available } = await request(value);
      setCheck({
        value,
        status: available ? "available" : "taken",
        message: available
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      });
    } catch (requestError) {
      setCheck({
        value,
        status: "error",
        message: getServerErrorMessage(requestError),
      });
    }
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isEmailChecked) {
      setSubmitError("이메일 중복 확인을 해 주세요.");
      return;
    }
    if (!isNicknameChecked) {
      setSubmitError("닉네임 중복 확인을 해 주세요.");
      return;
    }
    if (!PASSWORD_REGEX.test(password)) {
      setSubmitError("비밀번호 규칙을 확인해 주세요.");
      return;
    }
    if (password !== passwordConfirm) {
      setSubmitError("비밀번호가 일치하지 않아요.");
      return;
    }
    setSubmitError(null);
    signUpMutation.mutate(
      { email: trimmedEmail, nickname: trimmedNickname, password },
      {
        onSuccess: () => navigate({ to: "/login" }),
        onError: (error) => setSubmitError(getServerErrorMessage(error)),
      },
    );
  }

  return (
    <main className="flex justify-center px-4 pt-[214px] pb-24">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-[430px]"
      >
        <h1 className="mb-3 text-3xl font-bold text-ink">회원가입</h1>

        <Field label="이메일" htmlFor="signup-email" first>
          <div className={fieldBox}>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setSubmitError(null);
              }}
              placeholder="name@example.com"
              className={fieldInput}
            />
            <CheckButton
              pending={emailCheck.status === "checking"}
              onClick={() =>
                runCheck(
                  trimmedEmail,
                  validateEmail,
                  checkEmail,
                  "이메일",
                  setEmailCheck,
                )
              }
            />
          </div>
          <CheckMessage check={emailCheck} current={trimmedEmail} />
        </Field>

        <Field label="닉네임" htmlFor="signup-nickname">
          <div className={fieldBox}>
            <input
              id="signup-nickname"
              value={nickname}
              onChange={(event) => {
                setNickname(event.target.value);
                setSubmitError(null);
              }}
              placeholder="2–12자"
              className={fieldInput}
            />
            <CheckButton
              pending={nicknameCheck.status === "checking"}
              onClick={() =>
                runCheck(
                  trimmedNickname,
                  validateNickname,
                  checkNickname,
                  "닉네임",
                  setNicknameCheck,
                )
              }
            />
          </div>
          <CheckMessage check={nicknameCheck} current={trimmedNickname} />
        </Field>

        <Field label="비밀번호" htmlFor="signup-password">
          <div className={fieldBox}>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setSubmitError(null);
              }}
              placeholder="8자 이상"
              className={fieldInput}
            />
          </div>
          <p
            className={cn(
              "mt-1 text-[11px] leading-4",
              passwordError ? "text-danger" : "text-ink-subtle",
            )}
          >
            영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요
          </p>
        </Field>

        <Field label="비밀번호 확인" htmlFor="signup-password-confirm">
          <div className={fieldBox}>
            <input
              id="signup-password-confirm"
              type="password"
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(event) => {
                setPasswordConfirm(event.target.value);
                setSubmitError(null);
              }}
              placeholder="다시 입력"
              className={fieldInput}
            />
          </div>
          {passwordConfirmError && (
            <p className="mt-1 text-[11px] leading-4 text-danger">
              {passwordConfirmError}
            </p>
          )}
        </Field>

        {submitError && (
          <p role="alert" className="mt-3 text-xs font-medium text-danger">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={signUpMutation.isPending}
          className="mt-4.5 h-[46px] w-full rounded-md bg-brand text-sm font-bold text-surface transition-colors hover:bg-brand-hover active:bg-brand-pressed disabled:bg-brand-disabled"
        >
          {signUpMutation.isPending ? "가입 중…" : "가입하기"}
        </button>

        <p className="mt-4.5 text-center text-xs text-ink-muted">
          이미 계정이 있나요?{" "}
          <Link to="/login" className="font-bold text-brand">
            로그인
          </Link>
        </p>
      </form>
    </main>
  );
}

const fieldBox =
  "mt-2 flex h-12 items-center gap-2 rounded-lg border border-border bg-surface pr-3.5 pl-4 focus-within:border-ink";
const fieldInput =
  "min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-ink-subtle focus:outline-none";

interface FieldProps {
  label: string;
  htmlFor: string;
  first?: boolean;
  children: ReactNode;
}

function Field({ label, htmlFor, first, children }: FieldProps) {
  return (
    <div className={first ? undefined : "mt-4"}>
      <label htmlFor={htmlFor} className="text-xs font-bold text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}

function CheckButton({
  pending,
  onClick,
}: {
  pending: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="shrink-0 text-xs font-bold text-brand disabled:text-ink-subtle"
    >
      {pending ? "확인 중…" : "중복 확인"}
    </button>
  );
}

function CheckMessage({
  check,
  current,
}: {
  check: CheckState;
  current: string;
}) {
  if (!check.message || check.value !== current) {
    return null;
  }
  return (
    <p
      role={check.status === "available" ? "status" : "alert"}
      className={cn(
        "mt-1 text-[11px] leading-4 font-medium",
        check.status === "available" ? "text-brand" : "text-danger",
      )}
    >
      {check.message}
    </p>
  );
}
