// screens/auth/my-edit-page.tsx
"use client";

import { useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { getMe } from "../../api/members/me";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { useAuthStore } from "../../stores/auth-store";

function subscribeProfileImage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getProfileImageSnapshot() {
  return localStorage.getItem("profileImageUrl");
}

function getProfileImageServerSnapshot() {
  return null;
}

export function MyEditPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const updateMeMutation = useUpdateMeMutation();

  const initialNickname = meQuery.data?.nickname ?? "gs0428";
  const email = meQuery.data?.email ?? "gwangsoo@cinemalab.kr";

  const [nicknameInput, setNicknameInput] = useState<string | null>(null);
  const nickname = nicknameInput ?? initialNickname;

  const storedAvatarUrl = useSyncExternalStore(
    subscribeProfileImage,
    getProfileImageSnapshot,
    getProfileImageServerSnapshot,
  );
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState<string | null>(
    null,
  );
  const previewUrl = selectedPreviewUrl ?? storedAvatarUrl;

  const [duplicateCheck, setDuplicateCheck] = useState({
    isChecking: false,
    isAvailable: true,
  });

  const trimmedNickname = nickname.trim();
  const isNicknameValid =
    trimmedNickname.length >= 2 && trimmedNickname.length <= 12;
  const showNicknameError = nickname.length > 0 && !isNicknameValid;

  const isSameAsInitial = trimmedNickname === initialNickname;
  const canSubmit =
    isNicknameValid && (isSameAsInitial || duplicateCheck.isAvailable);

  const handleChangeNickname = (value: string) => {
    if (duplicateCheck.isChecking) return;
    setNicknameInput(value);
    setDuplicateCheck({
      isChecking: false,
      isAvailable: value.trim() === initialNickname,
    });
  };

  const handleSelectProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSelectedPreviewUrl(url);
    localStorage.setItem("profileImageUrl", url);
  };

  const handleCheckDuplicate = async () => {
    if (!isNicknameValid || duplicateCheck.isChecking) return;

    if (isSameAsInitial) {
      setDuplicateCheck({ isChecking: false, isAvailable: true });
      alert("현재 사용 중인 닉네임이에요.");
      return;
    }

    setDuplicateCheck({ isChecking: true, isAvailable: false });
    try {
      const response = await checkNicknameDuplicate(trimmedNickname);
      const isAvailable = response.available;
      setDuplicateCheck({ isChecking: false, isAvailable });
      alert(
        isAvailable
          ? "사용할 수 있는 닉네임이에요."
          : "이미 사용 중인 닉네임이에요.",
      );
    } catch {
      setDuplicateCheck({ isChecking: false, isAvailable: false });
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;

    updateMeMutation.mutate(
      { nickname: trimmedNickname },
      {
        onSuccess: () => {
          router.push("/my");
        },
      },
    );
  };

  return (
    <main className="flex min-h-[calc(100vh-91px)] flex-col bg-[#f6f7f9] px-5 py-10 md:px-[80px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-between gap-16">
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex items-start justify-between pb-10">
            <div className="flex flex-col gap-1">
              <h1 className="text-[34px] font-bold tracking-[-1.53px] text-[#17191e]">
                내 정보 수정
              </h1>
              <p className="text-sm font-normal text-[#606774]">
                닉네임과 프로필 이미지만 변경할 수 있어요.
              </p>
            </div>

            <button
              type="submit"
              disabled={!canSubmit || updateMeMutation.isPending}
              className="flex h-[42px] cursor-pointer items-center justify-center rounded-lg border-0 bg-[#2563eb] px-4 text-sm font-extrabold text-white transition-colors enabled:hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:bg-[#d9e5ff]"
            >
              {updateMeMutation.isPending ? "저장 중" : "변경사항 저장"}
            </button>
          </div>

          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#e3e6eb]">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="프로필 미리보기"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <svg
                      className="h-12 w-12 text-[#17191e]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2.5c-3.33 0-10 1.67-10 5v2.5h20v-2.5c0-3.33-6.67-5-10-5z" />
                    </svg>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="프로필 이미지 변경"
                  className="absolute right-0 bottom-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-[#17191e] bg-white text-[#17191e] hover:bg-[#f6f7f9]"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSelectProfileImage}
                  className="hidden"
                />
              </div>

              <span className="mt-3 text-sm font-extrabold text-[#17191e]">
                프로필 이미지
              </span>
              <span className="mt-0.5 text-[11px] font-normal text-[#969da8]">
                선택 사항 · 최대 5MB
              </span>
            </div>

            <div className="flex w-full flex-col gap-5">
              <div className="flex flex-col items-start gap-2 self-stretch w-full">
                <label
                  htmlFor="nickname"
                  className="text-[13px] font-extrabold text-[#17191e] leading-normal"
                >
                  닉네임
                </label>
                <div
                  className={`min-h-12 gap-[9px] px-[13px] py-3.5 bg-white rounded-lg border ${
                    showNicknameError ? "border-[#d92d20]" : "border-[#e3e6eb]"
                  } border-solid flex items-center self-stretch w-full`}
                >
                  <input
                    id="nickname"
                    name="nickname"
                    type="text"
                    value={nickname}
                    placeholder="2–12자"
                    disabled={duplicateCheck.isChecking}
                    aria-invalid={showNicknameError}
                    onChange={(e) => handleChangeNickname(e.target.value)}
                    className="flex-1 w-full bg-transparent border-0 outline-none text-sm font-normal text-[#17191e] placeholder:text-[#969da8] disabled:opacity-50"
                  />
                  <button
                    type="button"
                    disabled={!isNicknameValid || duplicateCheck.isChecking}
                    onClick={handleCheckDuplicate}
                    aria-label="닉네임 중복 확인"
                    className="inline-flex items-center justify-center shrink-0 bg-transparent border-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="font-extrabold text-[#2563eb] text-xs whitespace-nowrap">
                      {duplicateCheck.isChecking ? "확인 중" : "중복 확인"}
                    </span>
                  </button>
                </div>
                {showNicknameError && (
                  <p
                    className="text-[11px] font-normal text-[#d92d20]"
                    role="alert"
                  >
                    닉네임은 2–12자로 입력해 주세요
                  </p>
                )}
              </div>

              <div className="flex flex-col items-start gap-2 self-stretch w-full">
                <label
                  htmlFor="email"
                  className="text-[13px] font-extrabold text-[#17191e] leading-normal"
                >
                  이메일
                </label>
                <div className="min-h-12 px-[13px] py-3.5 bg-[#f6f7f9] rounded-lg border border-[#e3e6eb] border-solid flex items-center self-stretch w-full">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    readOnly
                    className="flex-1 w-full bg-transparent border-0 outline-none text-sm font-normal text-[#606774]"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#f97066] bg-[#fef3f2] px-6 py-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-extrabold text-[#d92d20]">회원 탈퇴</h2>
            <p className="text-xs font-normal text-[#d92d20]">
              탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수
              없습니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => alert("회원 탈퇴 기능은 준비 중입니다.")}
            className="cursor-pointer rounded-lg border border-[#f97066] bg-white px-4 py-2.5 text-xs font-extrabold text-[#d92d20] transition-colors hover:bg-[#fee4e2]"
          >
            회원 탈퇴
          </button>
        </section>
      </div>
    </main>
  );
}
