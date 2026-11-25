"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { memberQueries } from "@/api/members/member-queries";
import { useUpdateMeMutation } from "@/hooks/use-update-me-mutation";

const FORM_ID = "profile-form";

// 공통 스타일
const LABEL_CLASS = "text-[13px] font-extrabold text-[#17191e]";
const FIELD_BOX_CLASS =
  "flex min-h-12 items-center gap-2 rounded-lg border border-[#e3e6eb] bg-white px-[13px] py-[14px] focus-within:border-[#2563eb]";
const INPUT_CLASS =
  "min-w-0 flex-1 bg-transparent px-0.5 py-px text-sm text-[#17191e] outline-none placeholder:text-[#969da8]";

export function MyEditPage() {
  const meQuery = useQuery(memberQueries.me());
  const updateMeMutation = useUpdateMeMutation();
  // 사용자가 입력하기 전(null)에는 서버에서 받은 닉네임을 보여 줌
  const [nicknameInput, setNicknameInput] = useState<string | null>(null);

  const nicknameValue = nicknameInput ?? meQuery.data?.nickname ?? "";
  const nickname = nicknameValue.trim();
  const canSubmit = nickname.length >= 2 && nickname.length <= 12;

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;

    updateMeMutation.mutate({ nickname });
  };

  return (
    <main className="flex min-h-[calc(100vh-148px)] flex-col gap-8 bg-[#f6f7f9] px-20 py-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[9px]">
          <h1 className="text-[31px] font-bold tracking-[-1.24px] text-[#17191e]">
            내 정보 수정
          </h1>
          <p className="text-sm leading-[22.4px] text-[#606774]">
            닉네임과 프로필 이미지만 변경할 수 있어요.
          </p>
        </div>
        <button
          type="submit"
          form={FORM_ID}
          disabled={!canSubmit || updateMeMutation.isPending}
          className="h-[42px] rounded-lg bg-[#2563eb] px-4 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {updateMeMutation.isPending ? "저장 중" : "변경사항 저장"}
        </button>
      </div>

      <form id={FORM_ID} onSubmit={handleSubmit} className="flex items-center">
        {/* 프로필 이미지 */}
        <div className="flex h-[133px] flex-1 flex-col items-center justify-center gap-1">
          <div className="relative size-[82px]">
            <span className="flex size-full items-center justify-center overflow-hidden rounded-full bg-[#e3e6eb]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/person.svg" alt="" width={48} height={48} />
            </span>
            <button
              type="button"
              aria-label="프로필 이미지 변경"
              className="absolute -bottom-0.5 -right-0.5 flex size-6 items-center justify-center rounded-full border-2 border-[#17191e] bg-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/edit.svg" alt="" width={16} height={16} />
            </button>
          </div>
          <p className="text-[15px] font-bold text-[#17191e]">프로필 이미지</p>
          <p className="text-[11px] text-[#969da8]">선택 사항, 최대 5MB</p>
        </div>

        <div className="flex flex-1 flex-col gap-[17px]">
          <div className="flex flex-col gap-2">
            <label htmlFor="profile-nickname" className={LABEL_CLASS}>
              닉네임
            </label>
            <div className={FIELD_BOX_CLASS}>
              <input
                id="profile-nickname"
                type="text"
                value={nicknameValue}
                onChange={(e) => setNicknameInput(e.target.value)}
                className={INPUT_CLASS}
              />
              <button
                type="button"
                className="shrink-0 text-xs font-extrabold text-[#2563eb]"
              >
                중복 확인
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="profile-email" className={LABEL_CLASS}>
              이메일
            </label>
            <div className={FIELD_BOX_CLASS}>
              <input
                id="profile-email"
                type="email"
                value={meQuery.data?.email ?? ""}
                readOnly
                className={INPUT_CLASS}
              />
            </div>
          </div>
        </div>
      </form>

      {/* 회원 탈퇴 */}
      <section className="mt-auto flex items-center justify-between rounded-[10px] border border-[#d92d20] bg-[#d92d20]/10 p-5">
        <div className="flex w-[570px] max-w-full flex-col gap-1">
          <h2 className="text-sm font-bold text-[#d92d20]">회원 탈퇴</h2>
          <p className="text-[11px] leading-[16.5px] text-[#d92d20]">
            탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수
            없습니다.
          </p>
        </div>
        <button
          type="button"
          className="h-[42px] shrink-0 rounded-lg border border-[#d92d20] bg-white px-4 text-sm font-extrabold text-[#d92d20]"
        >
          회원 탈퇴
        </button>
      </section>
    </main>
  );
}
