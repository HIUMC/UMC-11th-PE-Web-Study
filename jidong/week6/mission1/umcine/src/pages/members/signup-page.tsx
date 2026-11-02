import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { checkEmail } from "../../api/members/check-email";
import { checkNickname } from "../../api/members/check-nickname";
import type { AvailabilityResponse } from "../../api/members/models";
import { cn } from "../../utils/cn";

type CheckStatus = "idle" | "checking" | "available" | "taken" | "error";

const statusMessage: Record<CheckStatus, string> = {
  idle: "",
  checking: "확인하는 중이에요.",
  available: "사용할 수 있어요.",
  taken: "이미 사용 중이에요.",
  error: "확인하지 못했어요. 서버가 켜져 있는지 확인해 주세요.",
};

interface DuplicateCheckFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  status: CheckStatus;
  onChange: (value: string) => void;
  onCheck: () => void;
}

function DuplicateCheckField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  status,
  onChange,
  onCheck,
}: DuplicateCheckFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2.5">
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="flex-1 text-sm outline-none"
        />
        <button
          type="button"
          onClick={onCheck}
          disabled={!value.trim() || status === "checking"}
          className="text-xs font-bold text-blue-600 disabled:text-gray-300"
        >
          중복 확인
        </button>
      </div>
      {status !== "idle" && (
        <p
          role="status"
          className={cn(
            "text-xs",
            status === "available" && "text-green-600",
            (status === "taken" || status === "error") && "text-red-500",
            status === "checking" && "text-gray-500",
          )}
        >
          {statusMessage[status]}
        </p>
      )}
    </div>
  );
}

async function runCheck(
  request: () => Promise<AvailabilityResponse>,
  setStatus: (status: CheckStatus) => void,
) {
  setStatus("checking");
  try {
    const { available } = await request();
    setStatus(available ? "available" : "taken");
  } catch {
    setStatus("error");
  }
}

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<CheckStatus>("idle");
  const [nickname, setNickname] = useState("");
  const [nicknameStatus, setNicknameStatus] = useState<CheckStatus>("idle");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // 회원가입 API는 6주차에 연결해요.
    alert("회원가입은 6주차에 연결될 예정이에요.");
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[360px] flex-col gap-4"
      >
        <h1 className="text-2xl font-bold">회원가입</h1>

        <DuplicateCheckField
          id="email"
          label="이메일"
          type="email"
          placeholder="name@example.com"
          value={email}
          status={emailStatus}
          onChange={(value) => {
            setEmail(value);
            setEmailStatus("idle"); // 값이 바뀌면 다시 확인해야 해요.
          }}
          onCheck={() => runCheck(() => checkEmail(email.trim()), setEmailStatus)}
        />

        <DuplicateCheckField
          id="nickname"
          label="닉네임"
          placeholder="2~12자"
          value={nickname}
          status={nicknameStatus}
          onChange={(value) => {
            setNickname(value);
            setNicknameStatus("idle");
          }}
          onCheck={() =>
            runCheck(() => checkNickname(nickname.trim()), setNicknameStatus)
          }
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-bold">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            placeholder="8자 이상"
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none"
          />
          <p className="text-xs text-gray-400">
            영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password-confirm" className="text-sm font-bold">
            비밀번호 확인
          </label>
          <input
            id="password-confirm"
            type="password"
            value={passwordConfirm}
            placeholder="다시 입력"
            onChange={(event) => setPasswordConfirm(event.target.value)}
            className="rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={emailStatus !== "available" || nicknameStatus !== "available"}
          className="mt-2 rounded-md bg-blue-600 py-3 text-sm font-bold text-white disabled:bg-blue-300"
        >
          가입하기
        </button>
        <p className="text-center text-xs text-gray-500">
          이미 계정이 있나요?{" "}
          <Link to="/" className="font-bold text-blue-600">
            로그인
          </Link>
        </p>
      </form>
    </main>
  );
}
