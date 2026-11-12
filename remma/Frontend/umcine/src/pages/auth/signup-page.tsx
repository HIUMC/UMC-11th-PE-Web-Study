import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { isHTTPError } from "ky";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup, type SignupResponse } from "../../api/members/signup";
import { cn } from "../../utils/cn";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../../utils/auth/validation";

type DuplicateStatus = "idle" | "checking" | "available" | "unavailable" | "error";

export function SignupPage() {
  const navigate = useNavigate();

  // 1. 입력값 상태
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // 2. 중복 확인 상태
  const [emailStatus, setEmailStatus] = useState<DuplicateStatus>("idle");
  const [nicknameStatus, setNicknameStatus] = useState<DuplicateStatus>("idle");

  // 3. 회원가입 제출 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null);

  // 4. 입력값 유효성 검사
  const trimmedEmail = email.trim();
  const trimmedNickname = nickname.trim();

  const isEmailValid = EMAIL_REGEX.test(trimmedEmail);
  const isNicknameValid =
    trimmedNickname.length >= 2 && trimmedNickname.length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(password);
  const isPasswordConfirmValid =
    passwordConfirm.length > 0 && password === passwordConfirm;

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
    if (!isEmailValid || emailStatus === "checking") return;

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
    if (!isNicknameValid || nicknameStatus === "checking") return;

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
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setSubmitErrorMessage(null);

    try {
      // passwordConfirm은 요청에 포함하지 않음
      const response = await signup({
        email: trimmedEmail,
        password,
        nickname: trimmedNickname,
      });

      alert(response.message || "회원가입에 성공했습니다.");
      navigate({ to: "/login" });
    } catch (error) {
      if (isHTTPError(error)) {
        try {
          const errorBody = await error.response.json<SignupResponse>();
          setSubmitErrorMessage(
            errorBody.message || "회원가입 요청에 실패했어요.",
          );
        } catch {
          setSubmitErrorMessage("회원가입 요청에 실패했어요.");
        }
      } else {
        setSubmitErrorMessage("서버와 연결할 수 없어요. 잠시 후 다시 시도해 주세요.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-6 py-12">
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
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailStatus("idle");
                }}
                placeholder="example@umcine.com"
                disabled={isSubmitting}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-600 disabled:bg-gray-50"
              />
              <button
                type="button"
                onClick={handleCheckEmail}
                disabled={!isEmailValid || emailStatus === "checking" || isSubmitting}
                className="shrink-0 rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {emailStatus === "checking" ? "확인 중..." : "중복 확인"}
              </button>
            </div>
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
                type="text"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setNicknameStatus("idle");
                }}
                placeholder="2~12자 이내로 입력"
                disabled={isSubmitting}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-600 disabled:bg-gray-50"
              />
              <button
                type="button"
                onClick={handleCheckNickname}
                disabled={
                  !isNicknameValid || nicknameStatus === "checking" || isSubmitting
                }
                className="shrink-0 rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {nicknameStatus === "checking" ? "확인 중..." : "중복 확인"}
              </button>
            </div>
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
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="대/소문자, 숫자, 특수문자 포함 8자 이상"
              disabled={isSubmitting}
              className="mt-1.5 w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-600 disabled:bg-gray-50"
            />
            {password.length > 0 && !isPasswordValid && (
              <p className="mt-1.5 text-xs text-red-600">
                대문자, 소문자, 숫자, 특수문자(!@#$%^&*)를 포함해 8자 이상 입력해 주세요.
              </p>
            )}
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
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="비밀번호를 한 번 더 입력"
              disabled={isSubmitting}
              className="mt-1.5 w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-600 disabled:bg-gray-50"
            />
            {passwordConfirm.length > 0 && !isPasswordConfirmValid && (
              <p className="mt-1.5 text-xs text-red-600">
                비밀번호가 일치하지 않아요.
              </p>
            )}
          </div>

          {/* 5. 서버 오류 안내 메시지 */}
          {submitErrorMessage && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
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
            {isSubmitting ? "가입 요청 중..." : "가입하기"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs font-medium text-gray-500 hover:text-gray-900 hover:underline"
          >
            영화 목록으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}

export default SignupPage;