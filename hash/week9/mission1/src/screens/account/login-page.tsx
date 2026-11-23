"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { accountKeys, changeSession } from "../../api/account-session";
import { readMemberApiError } from "../../api/api-client";
import {
  AccountPanel,
  accountButtonClass,
  accountInputClass,
  accountLinkClass,
} from "../../components/account/account-panel";
import { accountMutationOptions } from "../../hooks/use-account-mutations";
import { useAuthStore } from "../../stores/auth-store";
import { emailPattern } from "./signup-validation";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useMutation(accountMutationOptions.login());
  const client = useQueryClient();
  const router = useRouter();
  const canSubmit = emailPattern.test(email.trim()) && password.length > 0;
  const { isPending, isError, error, reset } = loginMutation;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || isPending || useAuthStore.getState().accessToken) return;

    loginMutation.mutate({ email: email.trim(), password }, {
      onSuccess: ({ accessToken }) => {
        const sessionId = changeSession(accessToken);
        setPassword("");
        reset();
        void client.invalidateQueries({ queryKey: accountKeys.me(sessionId), exact: true });
        router.replace("/");
      },
    });
  }

  return (
    <AccountPanel title="로그인" description="이메일과 비밀번호를 입력해 주세요." icon="lock">
      <form onSubmit={handleSubmit} aria-busy={isPending}>
        <fieldset disabled={isPending} className="space-y-4">
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
                if (isError) reset();
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
                if (isError) reset();
              }}
              placeholder="비밀번호 입력"
              className={accountInputClass}
            />
          </div>
          {isError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{readMemberApiError(error).message}</p>}
          <button type="submit" disabled={!canSubmit || isPending} className={accountButtonClass + " w-full"}>
            {isPending ? "로그인 중…" : "로그인"}
          </button>
        </fieldset>
      </form>
      <p className="mt-5 text-center text-sm text-[#555d6d]">
        계정이 없나요? <Link href="/signup" className={accountLinkClass}>회원가입</Link>
      </p>
    </AccountPanel>
  );
}
