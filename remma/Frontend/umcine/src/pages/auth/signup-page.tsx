import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { useSignupMutation } from "../../hooks/use-signup-mutation";
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  isValidNickname,
} from "../../utils/auth/validation";
import { cn } from "../../utils/cn";

type DuplicateStatus = "idle" | "checking" | "available" | "unavailable" | "error";

export function SignupPage() {
  // 1. 입력값 상태
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // 2. 중복 확인 상태
  const [emailStatus, setEmailStatus] = useState<DuplicateStatus>("idle");
  const [nicknameStatus, setNicknameStatus] = useState<DuplicateStatus>("idle");

  // 3. 회원가입 mutation (useMutation으로 진행·성공·실패 상태 관리)
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(
    null,
  );
  const signupMutation = useSignupMutation({
    onErrorMessage: setSubmitErrorMessage,
  });

  // 4. 입력값 유효성 검사
  const trimmedEmail = email.trim();
  const trimmedNickname = nickname.trim();

  const isEmailValid = EMAIL_REGEX.test(trimmedEmail);
  const isNicknameValid = isValidNickname(trimmedNickname);
  const isPasswordValid = PASSWORD_REGEX.test(password);
  const isPasswordConfirmValid =
    passwordConfirm.length > 0 && password === passwordConfirm;

  const isSubmitting = signupMutation.isPending;

  const canSubmit =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid &&
    emailStatus === "available" &&
    nicknameStatus === "available" &&
    !isSubmitting;

  // 이메일 중복 확인 핸들러
  async function handleCheckEmail() {
    if (!isEmailValid || emailStatus === "checking" || isSubmitting) return;

    setEmailStatus("checking");
    setSubmitErrorMessage(null);

    try {
      const response = await checkEmailDuplicate(trimmedEmail);
      setEmailStatus(response.available ? "available" : "unavailable");
    } catch {
      setEmailStatus("error");
    }
  }

  // 닉네임 중복 확인 핸들러
  async function handleCheckNickname() {
    if (!isNicknameValid || nicknameStatus === "checking" || isSubmitting) return;

    setNicknameStatus("checking");
    setSubmitErrorMessage(null);

    try {
      const response = await checkNicknameDuplicate(trimmedNickname);
      setNicknameStatus(response.available ? "available" : "unavailable");
    } catch {
      setNicknameStatus("error");
    }
  }

  // 회원가입 폼 제출 핸들러
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || signupMutation.isPending) return;

    setSubmitErrorMessage(null);
    signupMutation.mutate({
      email: trimmedEmail,
      password,
      nickname: trimmedNickname,
    });
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xs">
        <h1 className="text-2xl font-extrabold text-gray-950">회원가입</h1>
        <p className="mt-1 text-sm text-gray-500">
          UMCine 회원이 되어 영화 평점을 남겨보세요.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          {/* 1. 이메일 입력 및 중복 확인 */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-900"
            >
              이메일
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailStatus("idle");
                }}
                placeholder="example@umcine.com"
                disabled={isSubmitting}
                aria-invalid={
                  (email.length > 0 && !isEmailValid) ||
                  emailStatus === "unavailable"
                }
                aria-describedby="email-feedback"
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 transition-colors focus:border-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-50"
              />
              <button
                type="button"
                onClick={handleCheckEmail}
                disabled={
                  !isEmailValid || emailStatus === "checking" || isSubmitting
                }
                className="shrink-0 rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {emailStatus === "checking" ? "확인 중..." : "중복 확인"}
              </button>
            </div>
            <div id="email-feedback">
              {email.length > 0 && !isEmailValid && (
                <p className="mt-1.5 text-xs text-red-600">
                  올바른 이메일 형식을 입력해 주세요.
                </p>
              )}
              {isEmailValid && emailStatus === "available" && (
                <p className="mt-1.5 text-xs text-blue-600">
                  사용 가능한 이메일이에요.
                </p>
              )}
              {isEmailValid && emailStatus === "unavailable" && (
                <p className="mt-1.5 text-xs text-red-600">
                  이미 사용 중인 이메일이에요.
                </p>
              )}
              {emailStatus === "error" && (
                <p className="mt-1.5 text-xs text-red-600">
                  이메일 중복 확인에 실패했어요.
                </p>
              )}
            </div>
          </div>

          {/* 2. 닉네임 입력 및 중복 확인 */}
          <div>
            <label
              htmlFor="nickname"
              className="block text-sm font-semibold text-gray-900"
            >
              닉네임
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                id="nickname"
                name="nickname"
                type="text"
                autoComplete="nickname"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setNicknameStatus("idle");
                }}
                placeholder="2~12자 이내로 입력"
                disabled={isSubmitting}
                aria-invalid={
                  (nickname.length > 0 && !isNicknameValid) ||
                  nicknameStatus === "unavailable"
                }
                aria-describedby="nickname-feedback"
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 transition-colors focus:border-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-50"
              />
              <button
                type="button"
                onClick={handleCheckNickname}
                disabled={
                  !isNicknameValid ||
                  nicknameStatus === "checking" ||
                  isSubmitting
                }
                className="shrink-0 rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {nicknameStatus === "checking" ? "확인 중..." : "중복 확인"}
              </button>
            </div>
            <div id="nickname-feedback">
              {nickname.length > 0 && !isNicknameValid && (
                <p className="mt-1.5 text-xs text-red-600">
                  닉네임은 2자 이상 12자 이하로 입력해 주세요.
                </p>
              )}
              {isNicknameValid && nicknameStatus === "available" && (
                <p className="mt-1.5 text-xs text-blue-600">
                  사용 가능한 닉네임이에요.
                </p>
              )}
              {isNicknameValid && nicknameStatus === "unavailable" && (
                <p className="mt-1.5 text-xs text-red-600">
                  이미 사용 중인 닉네임이에요.
                </p>
              )}
              {nicknameStatus === "error" && (
                <p className="mt-1.5 text-xs text-red-600">
                  닉네임 중복 확인에 실패했어요.
                </p>
              )}
            </div>
          </div>

          {/* 3. 비밀번호 입력 */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-900"
            >
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="대/소문자, 숫자, 특수문자 포함 8자 이상"
              disabled={isSubmitting}
              aria-invalid={password.length > 0 && !isPasswordValid}
              aria-describedby="password-feedback"
              className="mt-1.5 w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 transition-colors focus:border-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-50"
            />
            <p
              id="password-feedback"
              className={cn(
                "mt-1.5 text-xs",
                password.length > 0 && !isPasswordValid
                  ? "text-red-600"
                  : "text-gray-400",
              )}
            >
              대문자, 소문자, 숫자, 특수문자(!@#$%^&amp;*)를 포함해 8자 이상
              입력해 주세요.
            </p>
          </div>

          {/* 4. 비밀번호 확인 입력 */}
          <div>
            <label
              htmlFor="passwordConfirm"
              className="block text-sm font-semibold text-gray-900"
            >
              비밀번호 확인
            </label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="비밀번호를 한 번 더 입력"
              disabled={isSubmitting}
              aria-invalid={
                passwordConfirm.length > 0 && !isPasswordConfirmValid
              }
              aria-describedby={
                passwordConfirm.length > 0 && !isPasswordConfirmValid
                  ? "password-confirm-error"
                  : undefined
              }
              className="mt-1.5 w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 transition-colors focus:border-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-50"
            />
            {passwordConfirm.length > 0 && !isPasswordConfirmValid && (
              <p
                id="password-confirm-error"
                className="mt-1.5 text-xs text-red-600"
              >
                비밀번호가 일치하지 않아요.
              </p>
            )}
          </div>

          {/* 5. 서버 오류 안내 메시지 */}
          {submitErrorMessage && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-xs font-medium text-red-600"
            >
              {submitErrorMessage}
            </div>
          )}

          {/* 6. 제출 버튼 */}
          <button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              "mt-2 w-full rounded-xl py-3 text-sm font-semibold text-white transition-colors",
              canSubmit
                ? "bg-blue-600 hover:bg-blue-700"
                : "cursor-not-allowed bg-gray-300",
            )}
          >
            {signupMutation.isPending ? "가입 요청 중..." : "가입하기"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
          <span>이미 계정이 있으신가요?</span>
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
