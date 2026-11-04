import { useRef, useState } from "react";
import { checkEmail, checkNickname } from "../../api/members";
import { Link } from "@tanstack/react-router";

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const emailRequest = useRef(0);
  const emailInput = useRef<HTMLInputElement>(null);

  const [nickname, setNickname] = useState("");
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const nicknameRequest = useRef(0);

  async function handleCheckEmail() {
    if (!emailInput.current?.reportValidity()) return;
    const requestId = ++emailRequest.current;
    setIsCheckingEmail(true);
    setEmailMessage("");
    try {
      const { available } = await checkEmail(email);
      console.log("이메일 중복 여부", available);
      if (requestId === emailRequest.current) {
        setEmailMessage(
          available
            ? "사용 가능한 이메일입니다."
            : "이미 사용 중인 이메일입니다.",
        );
      }
    } catch {
      if (requestId === emailRequest.current) {
        setEmailMessage("이메일 확인에 실패했어요. 다시 시도해 주세요.");
      }
    } finally {
      if (requestId === emailRequest.current) setIsCheckingEmail(false);
    }
  }

  async function handleCheckNickname() {
    const requestId = ++nicknameRequest.current;
    if (nickname.length < 2 || nickname.length > 12) {
      //기본 제약조건
      setNicknameMessage("닉네임은 2–12자로 입력해 주세요.");
      return;
    }
    setIsCheckingNickname(true);
    setNicknameMessage("");
    try {
      const { available } = await checkNickname(nickname);
      console.log("닉네임 중복 여부", available);
      if (requestId === nicknameRequest.current) {
        setNicknameMessage(
          available
            ? "사용 가능한 닉네임입니다."
            : "이미 사용 중인 닉네임입니다.",
        );
      }
    } catch {
      if (requestId === nicknameRequest.current) {
        setNicknameMessage("닉네임 확인에 실패했어요. 다시 시도해 주세요.");
      }
    } finally {
      if (requestId === nicknameRequest.current) setIsCheckingNickname(false);
    }
  }

  const inputClassName =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-blue-600";

  return (
    <main className="flex min-h-[calc(100dvh-73px)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-4 text-3xl font-bold">회원가입</h1>
        <form
          className="space-y-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-semibold"
            >
              이메일
            </label>
            <div className="relative">
              <input
                id="email"
                ref={emailInput}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  emailRequest.current += 1;
                  setEmailMessage("");
                  setIsCheckingEmail(false);
                }}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                required
                className={`${inputClassName} pr-24`}
              />
              <button
                type="button"
                onClick={handleCheckEmail}
                disabled={isCheckingEmail}
                className="absolute inset-y-0 right-4 text-xs font-semibold text-blue-600"
              >
                {isCheckingEmail ? "확인 중" : "중복 확인"}
              </button>
            </div>
            <p role="status" className="mt-1.5 text-xs text-gray-500">
              {emailMessage}
            </p>
          </div>
          <div>
            <label
              htmlFor="nickname"
              className="mb-1.5 block text-xs font-semibold"
            >
              닉네임
            </label>
            <div className="relative">
              <input
                id="nickname"
                name="nickname"
                value={nickname}
                onChange={(event) => {
                  setNickname(event.target.value);
                  nicknameRequest.current += 1;
                  setNicknameMessage("");
                  setIsCheckingNickname(false);
                }}
                autoComplete="nickname"
                placeholder="2–12자"
                minLength={2}
                maxLength={12}
                required
                className={`${inputClassName} pr-24`}
              />
              <button
                type="button"
                onClick={handleCheckNickname}
                disabled={isCheckingNickname}
                className="absolute inset-y-0 right-4 text-xs font-semibold text-blue-600"
              >
                {isCheckingNickname ? "확인 중" : "중복 확인"}
              </button>
            </div>
            <p role="status" className="mt-1.5 text-xs text-gray-500">
              {nicknameMessage}
            </p>
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-semibold"
            >
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="8자 이상"
              minLength={8}
              required
              aria-describedby="password-help"
              className={inputClassName}
            />
            <p id="password-help" className="mt-1.5 text-[10px] text-gray-400">
              영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해
              주세요
            </p>
          </div>
          <div>
            <label
              htmlFor="password-confirm"
              className="mb-1.5 block text-xs font-semibold"
            >
              비밀번호 확인
            </label>
            <input
              id="password-confirm"
              name="passwordConfirm"
              type="password"
              autoComplete="new-password"
              placeholder="다시 입력"
              minLength={8}
              required
              className={inputClassName}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-[#2563EB] py-3 text-sm font-semibold text-white"
          >
            가입하기
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-gray-500">
          이미 계정이 있나요?{" "}
          <Link to="/login" className="font-semibold text-blue-600">
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}
