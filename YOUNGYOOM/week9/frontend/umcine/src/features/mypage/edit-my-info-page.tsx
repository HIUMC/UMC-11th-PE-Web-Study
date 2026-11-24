"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { getMe } from "../../api/members/me";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { useAuthStore } from "../../stores/auth-store";

export function EditMyInfoPage() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const updateMeMutation = useUpdateMeMutation();

  // 헤더와 같은 쿼리 키를 사용해서 내 정보 캐시를 공유
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const [editedNickname, setEditedNickname] = useState<string | null>(null);
  const [availableNickname, setAvailableNickname] = useState<string | null>(
    null,
  );
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);

  // 사용자가 입력하기 전까지는 서버에서 조회한 닉네임을 표시
  const nickname = editedNickname ?? meQuery.data?.nickname ?? "";
  const trimmedNickname = nickname.trim();
  const isNicknameValid =
    trimmedNickname.length >= 2 && trimmedNickname.length <= 12;

  const canEdit = Boolean(accessToken && meQuery.data);
  const isSaving = updateMeMutation.isPending;

  // 현재 입력값이 기존 닉네임과 다르고, 같은 값으로 중복 확인을 통과해야 저장 가능
  const canSubmit =
    canEdit &&
    isNicknameValid &&
    trimmedNickname !== meQuery.data?.nickname &&
    trimmedNickname === availableNickname &&
    !isCheckingNickname &&
    !isSaving;

  const handleCheckNickname = async () => {
    if (!canEdit || isCheckingNickname || isSaving) return;

    if (!isNicknameValid) {
      alert("닉네임은 2–12자로 입력해 주세요.");
      return;
    }

    setIsCheckingNickname(true);
    setAvailableNickname(null);

    try {
      const { available } = await checkNicknameDuplicate(trimmedNickname);

      // 중복 확인을 통과한 닉네임을 기록해 저장할 때 비교
      if (available) {
        setAvailableNickname(trimmedNickname);
      }

      alert(
        available
          ? "사용할 수 있는 닉네임이에요."
          : "이미 사용 중인 닉네임이에요.",
      );
    } catch {
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsCheckingNickname(false);
    }
  };

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    updateMeMutation.mutate(
      { nickname: trimmedNickname },
      {
        // 수정 훅에서 내 정보 캐시를 갱신한 뒤 마이페이지로 이동
        onSuccess: () => {
          void router.push("/mypage");
        },
      },
    );
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-76px)] w-full max-w-[1440px] flex-col px-6 pt-6 pb-7 text-[#191B20] sm:px-20">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-[28px] font-bold">내 정보 수정</h2>
            <p className="mt-2 text-sm text-gray-500">
              닉네임과 프로필 이미지만 변경할 수 있어요.
            </p>
          </div>
          <button
            type="submit"
            disabled={!canSubmit}
            className="shrink-0 rounded-lg bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "저장 중" : "변경사항 저장"}
          </button>
        </div>

        <div className="mt-9 grid items-center gap-8 md:grid-cols-2 md:gap-0">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="flex size-20 items-center justify-center rounded-full bg-[#E3E6EB]">
                <img
                  src="/icons/person.svg"
                  alt="기본 프로필"
                  className="size-10"
                />
              </div>
              <button
                type="button"
                aria-label="프로필 이미지 변경"
                className="absolute right-0 bottom-0 flex size-6 items-center justify-center rounded-full border-2 border-[#191B20] bg-gray-100"
              >
                <img src="/icons/edit.svg" alt="" className="size-4" />
              </button>
            </div>
            <h3 className="mt-1 text-sm font-bold">프로필 이미지</h3>
            <p className="mt-1 text-xs text-gray-400">선택 사항 · 최대 5MB</p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="nickname"
                className="mb-2 block text-sm font-bold"
              >
                닉네임
              </label>
              <div className="flex items-center rounded-lg border border-[#E3E6EB] bg-white focus-within:ring-2 focus-within:ring-blue-500">
                <input
                  id="nickname"
                  name="nickname"
                  value={nickname}
                  onChange={(event) => {
                    setEditedNickname(event.target.value);
                    // 입력값이 바뀌면 이전 중복 확인 결과를 초기화
                    setAvailableNickname(null);
                  }}
                  disabled={
                    !canEdit || isCheckingNickname || updateMeMutation.isPending
                  }
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none"
                />
                {/* 중복 확인 버튼을 눌러도 폼이 제출되지 않도록 설정 */}
                <button
                  type="button"
                  onClick={handleCheckNickname}
                  disabled={!canEdit || isCheckingNickname || isSaving}
                  className="shrink-0 px-4 py-3 text-xs font-semibold text-[#2563EB]"
                >
                  {isCheckingNickname ? "확인 중" : "중복 확인"}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-bold">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={meQuery.data?.email ?? ""}
                readOnly
                className="w-full rounded-lg border border-[#E3E6EB] bg-white px-4 py-3 text-sm"
              />
            </div>
          </div>
        </div>
      </form>

      <section aria-labelledby="withdrawal" className="mt-auto pt-16">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-[#FF3B30] bg-[#FF3B30]/10 p-5 text-[#FF3B30]">
          <div>
            <h3 id="withdrawal" className="text-sm font-bold">
              회원 탈퇴
            </h3>
            <p className="mt-1 text-xs">
              탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수
              없습니다.
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-lg border border-[#FF3B30] bg-white px-4 py-3 text-sm font-semibold"
          >
            회원 탈퇴
          </button>
        </div>
      </section>
    </main>
  );
}
