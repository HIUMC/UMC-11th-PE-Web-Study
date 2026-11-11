import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  AccountPanel,
  accountButtonClass,
  accountInputClass,
  accountLinkClass,
} from "../../components/account/account-panel";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPreviewNotice, setShowPreviewNotice] = useState(false);

  return (
    <AccountPanel title="로그인" description="이메일과 비밀번호를 입력해 주세요." icon="lock">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setShowPreviewNotice(true);
        }}
      >
        <div>
          <label htmlFor="login-email" className="mb-1.5 block text-sm font-semibold">이메일</label>
          <input
            id="login-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setShowPreviewNotice(false);
            }}
            placeholder="name@example.com"
            className={accountInputClass}
          />
        </div>
        <div>
          <label htmlFor="login-password" className="mb-1.5 block text-sm font-semibold">비밀번호</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setShowPreviewNotice(false);
            }}
            placeholder="비밀번호 입력"
            className={accountInputClass}
          />
        </div>

        <button
          type="submit"
          disabled={!email.trim() || !password}
          className={accountButtonClass + " w-full"}
        >
          로그인
        </button>
        {showPreviewNotice && (
          <p role="status" className="rounded-lg bg-[#f3f5ff] p-3 text-sm text-[#344fc4]">
            로그인 화면 미리보기예요. 입력값을 서버로 보내지 않았어요.
          </p>
        )}
      </form>

      <p className="mt-5 text-center text-sm text-[#555d6d]">
        계정이 없나요? <Link to="/signup" className={accountLinkClass}>회원가입</Link>
      </p>
    </AccountPanel>
  );
}
