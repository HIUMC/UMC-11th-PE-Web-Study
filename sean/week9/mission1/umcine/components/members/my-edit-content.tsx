"use client";

import { useState, type FormEvent } from "react";
import type { MemberInfo } from "@/api/members/me";
import { useMeQuery } from "@/hooks/use-me-query";
import { useUpdateMeMutation } from "@/hooks/use-update-me-mutation";
import { AvatarIcon } from "./avatar-icon";

function PencilIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" />
    </svg>
  );
}

export function MyEditContent() {
  const meQuery = useMeQuery();

  if (meQuery.isPending) {
    return (
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-[#f5f6f8]">
        <p className="text-neutral-500">불러오는 중이에요.</p>
      </main>
    );
  }

  if (!meQuery.data) {
    return (
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-[#f5f6f8]">
        <p className="text-neutral-500">내 정보를 불러오지 못했어요.</p>
      </main>
    );
  }

  return <MyEditForm member={meQuery.data} />;
}

/**
 * 서버에서 받은 값으로 useState 초기값을 채워야 하므로 컴포넌트를 나눴습니다.
 * 데이터가 도착한 뒤에 이 컴포넌트를 처음 그리면, 그 시점 값이 초기값이 됩니다.
 */
function MyEditForm({ member }: { member: MemberInfo }) {
  const [nickname, setNickname] = useState(member.nickname);
  const updateMeMutation = useUpdateMeMutation();

  const trimmedNickname = nickname.trim();
  const canSubmit = trimmedNickname.length >= 2 && trimmedNickname.length <= 12;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;

    updateMeMutation.mutate({ nickname: trimmedNickname });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <main className="flex min-h-[calc(100vh-73px)] flex-col bg-[#f5f6f8] pb-10">
        <div className="mx-auto w-full max-w-[1200px] flex-1 px-6">
          <div className="flex items-start justify-between pt-10">
            <div>
              <h1 className="text-[32px] font-bold text-neutral-900">내 정보 수정</h1>
              <p className="mt-2 text-sm text-neutral-500">
                닉네임과 프로필 이미지만 변경할 수 있어요.
              </p>
            </div>
            <button
              type="submit"
              disabled={!canSubmit || updateMeMutation.isPending}
              className="inline-flex shrink-0 cursor-pointer items-center rounded-md bg-blue-600 px-5 py-3 text-sm font-bold text-white disabled:cursor-default disabled:bg-neutral-300"
            >
              {updateMeMutation.isPending ? "저장 중" : "변경사항 저장"}
            </button>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-16">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="flex h-[112px] w-[112px] items-center justify-center rounded-full bg-neutral-200">
                  <AvatarIcon className="h-14 w-14 text-neutral-500" />
                </div>
                <button
                  type="button"
                  aria-label="프로필 이미지 변경"
                  className="absolute right-0 bottom-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700"
                >
                  <PencilIcon />
                </button>
              </div>
              <p className="mt-4 text-sm font-bold text-neutral-900">프로필 이미지</p>
              <p className="mt-1 text-xs text-neutral-400">선택 사항 · 최대 5MB</p>
            </div>

            <div>
              <label
                htmlFor="nickname"
                className="block text-sm font-bold text-neutral-900"
              >
                닉네임
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-4 py-3.5">
                <input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  className="flex-1 text-sm text-neutral-900 outline-none"
                />
                <button
                  type="button"
                  className="shrink-0 cursor-pointer text-sm font-bold text-blue-600"
                >
                  중복 확인
                </button>
              </div>
              {!canSubmit && (
                <p className="mt-1.5 text-xs text-red-600">
                  닉네임은 2자 이상 12자 이하로 입력해 주세요.
                </p>
              )}

              <label
                htmlFor="email"
                className="mt-5 block text-sm font-bold text-neutral-900"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={member.email}
                readOnly
                className="mt-2 w-full rounded-md border border-neutral-200 bg-white px-4 py-3.5 text-sm text-neutral-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 w-full max-w-[1200px] px-6">
          <div className="flex items-center justify-between rounded-lg border border-red-300 bg-red-50 px-6 py-5">
            <div>
              <p className="text-sm font-bold text-red-600">회원 탈퇴</p>
              <p className="mt-1 text-xs text-red-500">
                탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.
              </p>
            </div>
            <button
              type="button"
              className="shrink-0 cursor-pointer rounded-md border border-red-400 bg-white px-5 py-2.5 text-sm font-bold text-red-600"
            >
              회원 탈퇴
            </button>
          </div>
        </div>
      </main>
    </form>
  );
}
