"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState, type SubmitEvent } from "react";
import { getMemberErrorMessage } from "../../api/api-client";
import { FormField, primaryButtonClass } from "../../components/auth/form-field";
import { RequestState } from "../../components/movies/request-state";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { meOptions } from "../../queries/account-queries";
import { useAuthStore } from "../../stores/auth-store";
import type { MemberInfo } from "../../types/account";
import { isNicknameValid } from "../../utils/auth-validation";

export function EditProfilePage() {
  const accessToken = useAuthStore(state => state.accessToken);
  const me = useQuery(meOptions(accessToken));
  return <main className="flex flex-1 justify-center px-4 py-12 sm:py-20">
    <section className="w-full max-w-108" aria-labelledby="edit-profile-title">
      <h1 id="edit-profile-title" className="text-3xl font-extrabold tracking-tight">내 정보 수정</h1>
      {me.isLoading ? <RequestState loading message="내 정보를 불러오는 중..." /> : me.isError ?
        <RequestState message={getMemberErrorMessage(me.error, "내 정보를 불러오지 못했어요.")} onRetry={() => { void me.refetch(); }} /> :
        me.data && <EditProfileForm key={me.data.email} profile={me.data} />}
    </section>
  </main>;
}

function EditProfileForm({ profile }: { profile: MemberInfo }) {
  const [nickname, setNickname] = useState(profile.nickname);
  const mutation = useUpdateMeMutation();
  const router = useRouter();
  const isValid = isNicknameValid(nickname);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid || mutation.isPending) return;
    mutation.mutate({ nickname: nickname.trim() }, { onSuccess: () => { router.push("/mypage"); } });
  }

  return <form onSubmit={handleSubmit} noValidate aria-busy={mutation.isPending} className="mt-8 space-y-6 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
    <div className="mx-auto grid size-20 place-items-center rounded-full bg-blue-50"><img src="/icons/person.svg" alt="기본 프로필" className="size-10 opacity-60" /></div>
    <FormField id="profile-email" label="이메일" type="email" value={profile.email} readOnly hint="이메일은 변경할 수 없어요." />
    <FormField id="profile-nickname" label="닉네임" name="nickname" autoComplete="nickname" value={nickname} disabled={mutation.isPending}
      onChange={event => { setNickname(event.target.value); mutation.reset(); }} hint="2~12자로 입력해 주세요."
      error={!isValid ? "닉네임은 2~12자로 입력해 주세요." : undefined} />
    {mutation.isError && <p role="alert" className="text-sm text-red-700">{getMemberErrorMessage(mutation.error, "내 정보를 수정하지 못했어요.")}</p>}
    <button type="submit" className={primaryButtonClass} disabled={!isValid || mutation.isPending}>{mutation.isPending ? "저장 중" : "저장하기"}</button>
    <Link href="/mypage" className="block rounded py-1 text-center text-sm font-semibold text-slate-500 hover:text-slate-900">취소</Link>
  </form>;
}
