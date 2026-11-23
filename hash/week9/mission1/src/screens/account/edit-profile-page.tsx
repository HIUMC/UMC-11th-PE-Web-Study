"use client";

import Link from "next/link";
import { useState } from "react";
import { readMemberApiError } from "../../api/api-client";
import type { MemberInfo } from "../../api/members/account-api";
import {
  AccountPanel,
  accountButtonClass,
  accountInputClass,
  accountLinkClass,
} from "../../components/account/account-panel";
import { useUpdateMeMutation } from "../../hooks/use-account-mutations";
import { useMe } from "../../hooks/use-account-queries";
import { useAuthStore } from "../../stores/auth-store";

export function EditProfilePage() {
  const me = useMe();
  const sessionId = useAuthStore((state) => state.sessionId);

  return (
    <AccountPanel title="내 정보 수정" description="닉네임을 수정할 수 있어요." icon="edit">
      {me.data ? (
        <EditProfileForm sessionId={sessionId} member={me.data} />
      ) : me.isError ? (
        <div role="alert" className="space-y-2 text-sm text-red-800">
          <p>{readMemberApiError(me.error).message}</p>
          <button type="button" onClick={() => void me.refetch()} className={accountLinkClass}>다시 시도</button>
        </div>
      ) : (
        <p role="status" className="text-sm">{me.isPaused ? "네트워크 연결을 기다리는 중이에요." : "내 정보를 불러오는 중이에요."}</p>
      )}
      <div className="mt-5 text-center text-sm">
        <Link href="/mypage" className={accountLinkClass}>내 정보로 돌아가기</Link>
      </div>
    </AccountPanel>
  );
}

function EditProfileForm({ sessionId, member }: { sessionId: number; member: MemberInfo }) {
  const [draft, setDraft] = useState<string | null>(null);
  const update = useUpdateMeMutation(sessionId);
  const nickname = draft ?? member.nickname;
  const normalized = nickname.trim();
  const invalid = normalized.length < 2 || normalized.length > 12;

  return (
    <form
      aria-busy={update.isPending}
      onSubmit={(event) => {
        event.preventDefault();
        if (invalid || update.isPending) return;
        update.mutate(normalized, { onSuccess: () => setDraft(null) });
      }}
    >
      <fieldset disabled={update.isPending} className="space-y-4">
        <div>
          <label htmlFor="profile-email" className="mb-1.5 block text-sm font-semibold">이메일</label>
          <input id="profile-email" type="email" value={member.email} readOnly className={accountInputClass} />
        </div>
        <div>
          <label htmlFor="profile-nickname" className="mb-1.5 block text-sm font-semibold">닉네임</label>
          <input
            id="profile-nickname"
            autoComplete="nickname"
            required
            value={nickname}
            onChange={(event) => {
              setDraft(event.target.value);
              update.reset();
            }}
            aria-invalid={invalid}
            aria-describedby="profile-nickname-help"
            className={accountInputClass}
          />
          <p id="profile-nickname-help" className={"mt-1 text-xs " + (invalid ? "text-red-700" : "text-[#555d6d]")}>
            닉네임을 2~12자로 입력해 주세요.
          </p>
        </div>
        <button type="submit" disabled={invalid || update.isPending} className={accountButtonClass + " w-full"}>
          {update.isPending ? "저장 중…" : "저장"}
        </button>
        {update.isSuccess && <p role="status" className="text-sm text-emerald-800">닉네임을 수정했어요.</p>}
        {update.isError && <p role="alert" className="text-sm text-red-800">{readMemberApiError(update.error).message}</p>}
      </fieldset>
    </form>
  );
}
