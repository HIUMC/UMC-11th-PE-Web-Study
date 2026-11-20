import { useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/members/me";
import { checkNicknameDuplicate } from "../api/members/check-nickname-duplicate";
import { useUpdateMeMutation } from "../hooks/use-update-me-mutation";
import { useAuthStore } from "../stores/auth-store";
const blueButton =
  "inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-[#2563eb] px-4 text-xs font-bold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50";
function Avatar({ image }: { image: string | null }) {
  return (
    <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e2e5e9]">
      {image ? (
        <img
          src={image}
          alt="프로필 미리보기"
          className="h-full w-full object-cover"
        />
      ) : (
        <img src="/icons/movie-icons/person.svg" alt="" className="h-9 w-9" />
      )}
    </div>
  );
}

export function AccountEditPage() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const member = meQuery.data;
  const [nicknameDraft, setNickname] = useState<string | null>(null);
  const nickname = nicknameDraft ?? member?.nickname ?? "";
  const [preview, setPreview] = useState<string | null>(null);

  const onClose = () => {
    void navigate({ to: "/account" });
  };
  const [imageError, setImageError] = useState("");
  const [checkResult, setCheckResult] = useState("");
  const [checking, setChecking] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const mutation = useUpdateMeMutation();
  const trimmedNickname = nickname.trim();
  const isValid = trimmedNickname.length >= 2 && trimmedNickname.length <= 12;

  async function checkNickname() {
    if (!isValid || checking || mutation.isPending) return;
    if (trimmedNickname === member?.nickname) {
      setCheckResult("현재 사용 중인 닉네임이에요.");
      return;
    }
    setChecking(true);
    setCheckResult("");
    try {
      const response = await checkNicknameDuplicate(trimmedNickname);
      setCheckResult(
        response.available
          ? "사용 가능한 닉네임이에요."
          : "이미 사용 중인 닉네임이에요.",
      );
    } catch {
      setCheckResult("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setChecking(false);
    }
  }

  function selectImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setImageError("JPG, PNG, WebP 이미지를 선택해 주세요.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError("5MB 이하의 이미지를 선택해 주세요.");
      return;
    }
    setImageError("");
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setPreview(reader.result);
    };
    reader.onerror = () =>
      setImageError("이미지를 읽지 못했어요. 다시 선택해 주세요.");
    reader.readAsDataURL(file);
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken || !isValid || checking || mutation.isPending) return;
    mutation.mutate(
      { nickname: trimmedNickname },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-90px)] flex-1 flex-col bg-[#F6F7F9]">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 pb-6 pt-6 sm:px-8 md:px-10 xl:px-20"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={onClose}
              disabled={mutation.isPending}
              className="mb-2 text-xs text-gray-500 hover:text-gray-900"
            >
              ← 내 정보
            </button>
            <h1 className="text-[32px] font-bold tracking-tight">
              내 정보 수정
            </h1>
            <p className="mt-2 text-xs text-gray-500">
              닉네임과 프로필 이미지만 변경할 수 있어요.
            </p>
          </div>
          <button
            type="submit"
            className={blueButton}
            disabled={
              !accessToken || !isValid || checking || mutation.isPending
            }
          >
            {mutation.isPending ? "저장 중" : "변경사항 저장"}
          </button>
        </div>
        {!accessToken && (
          <p className="mt-3 text-xs text-gray-500" role="status">
            닉네임 저장은{" "}
            <Link to="/login" className="font-semibold text-blue-600 underline">
              로그인
            </Link>{" "}
            후 가능해요.
          </p>
        )}
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6">
          <div className="flex flex-col items-center justify-center pb-2 pt-4">
            <button
              type="button"
              aria-label="프로필 이미지 선택"
              onClick={() => fileInput.current?.click()}
              disabled={mutation.isPending}
              className="relative rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
            >
              <Avatar image={preview} />
              <span className="absolute -bottom-0.5 right-0 flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-[#191c21] bg-[#F6F7F9]">
                <img
                  src="/icons/movie-icons/edit.svg"
                  alt=""
                  className="h-3 w-3"
                />
              </span>
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={selectImage}
              className="hidden"
            />
            <p className="mt-1 text-sm font-bold">프로필 이미지</p>
            <p className="mt-1 text-[10px] text-gray-400">
              선택 사항 · 최대 5MB
            </p>
            <p className="mt-1 text-[10px] text-gray-400">
              이미지는 현재 화면에서만 미리 볼 수 있어요.
            </p>
            {imageError && (
              <p role="alert" className="mt-2 text-xs text-red-500">
                {imageError}
              </p>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="nickname"
                className="mb-1.5 block text-xs font-bold"
              >
                닉네임
              </label>
              <div className="flex h-11 items-center rounded-lg border border-[#e0e4eb] bg-white px-3.5 focus-within:border-blue-600">
                <input
                  id="nickname"
                  value={nickname}
                  disabled={checking || mutation.isPending}
                  onChange={(event) => {
                    setNickname(event.target.value);
                    setCheckResult("");
                  }}
                  placeholder="닉네임 2~12자"
                  className="min-w-0 flex-1 bg-transparent text-xs outline-none"
                  aria-describedby="nickname-result"
                />
                <button
                  type="button"
                  disabled={!isValid || checking || mutation.isPending}
                  onClick={() => void checkNickname()}
                  className="ml-3 shrink-0 text-[10px] font-bold text-blue-600 disabled:opacity-40"
                >
                  {checking ? "확인 중" : "중복 확인"}
                </button>
              </div>
              <p
                id="nickname-result"
                role="status"
                className="mt-1.5 text-[11px] text-gray-500"
              >
                {checkResult ||
                  (nickname.length > 0 && !isValid
                    ? "닉네임은 2~12자로 입력해 주세요."
                    : "")}
              </p>
            </div>
            <div>
              <label
                htmlFor="profile-email"
                className="mb-1.5 block text-xs font-bold"
              >
                이메일
              </label>
              <input
                id="profile-email"
                type="email"
                readOnly
                value={member?.email ?? ""}
                placeholder="로그인 후 이메일이 표시돼요"
                className="h-11 w-full rounded-lg border border-[#e0e4eb] bg-white px-3.5 text-xs outline-none"
              />
            </div>
          </div>
        </div>
        <section
          aria-label="회원 탈퇴"
          className="mt-auto flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#ff4b40] bg-[#fff0ef] px-[18px] py-[18px] text-[#ff3b30] max-md:mt-16"
        >
          <div>
            <h2 className="text-xs font-bold">회원 탈퇴</h2>
            <p className="mt-1 text-[10px]">
              탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수
              없습니다.
            </p>
          </div>
          <button
            type="button"
            disabled
            title="회원 탈퇴 기능은 아직 사용할 수 없어요"
            className="h-9 rounded-lg border border-[#ff4b40] bg-white px-4 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-60"
          >
            회원 탈퇴
          </button>
        </section>
      </form>
    </main>
  );
}
