import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from "react";
import { checkNickname } from "../../api/members-api";
import { getServerErrorMessage } from "../../api/request-error";
import { ProfileAvatar } from "../../components/members/profile-avatar";
import { useBookmarkStore } from "../../stores/bookmark-store";
import type { AvailabilityResponse } from "../../types/member";
import { useProfileStore } from "../../stores/profile-store";
import { cn } from "../../utils/cn";

const FORM_ID = "profile-edit-form";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function validateNickname(nickname: string) {
  if (nickname.length < 2 || nickname.length > 12) {
    return "닉네임은 2~12자로 입력해 주세요.";
  }
  return null;
}

export function MyInfoEditPage() {
  const navigate = useNavigate();
  const email = useProfileStore((state) => state.email);
  const savedNickname = useProfileStore((state) => state.nickname);
  const savedImageUrl = useProfileStore((state) => state.profileImageUrl);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const resetProfile = useProfileStore((state) => state.reset);
  const clearBookmarks = useBookmarkStore((state) => state.clearBookmarks);

  const [nickname, setNickname] = useState(savedNickname);
  const [previewUrl, setPreviewUrl] = useState(savedImageUrl);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nicknameCheck = useMutation({ mutationFn: checkNickname });

  useEffect(() => {
    return () => {
      if (
        previewUrl &&
        previewUrl !== useProfileStore.getState().profileImageUrl
      ) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      setImageError("이미지 파일만 올릴 수 있어요.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("5MB 이하의 이미지만 올릴 수 있어요.");
      return;
    }
    setImageError(null);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleNicknameChange(value: string) {
    setNickname(value);
    setNicknameError(null);
    nicknameCheck.reset();
  }

  function handleCheckNickname() {
    const trimmed = nickname.trim();
    const error = validateNickname(trimmed);
    setNicknameError(error);
    if (!error) {
      nicknameCheck.mutate(trimmed);
    }
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = nickname.trim();
    const error = validateNickname(trimmed);
    if (error) {
      setNicknameError(error);
      return;
    }
    updateProfile({ nickname: trimmed, profileImageUrl: previewUrl });
    navigate({ to: "/me" });
  }

  function handleWithdraw() {
    if (
      !window.confirm(
        "정말 탈퇴할까요? 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없어요.",
      )
    ) {
      return;
    }
    resetProfile();
    clearBookmarks();
    navigate({ to: "/" });
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-90px)] max-w-[1312px] flex-col px-4 pt-6 pb-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-ink">내 정보 수정</h1>
          <p className="mt-2 text-sm text-ink-muted">
            닉네임과 프로필 이미지만 변경할 수 있어요.
          </p>
        </div>
        <button
          type="submit"
          form={FORM_ID}
          className="mt-4 h-10 shrink-0 rounded-md bg-brand px-4 text-sm font-bold text-surface transition-colors hover:bg-brand-hover active:bg-brand-pressed"
        >
          변경사항 저장
        </button>
      </div>

      <form
        id={FORM_ID}
        onSubmit={handleSubmit}
        noValidate
        className="mt-[27px] mb-16 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-0"
      >
        <div className="flex flex-col items-center lg:mt-[27px]">
          <button
            type="button"
            aria-label="프로필 이미지 변경"
            onClick={() => fileInputRef.current?.click()}
            className="relative"
          >
            <ProfileAvatar imageUrl={previewUrl} />
            <span className="absolute -right-1 bottom-0 rounded-full bg-surface">
              <img src="/icons/edit.svg" alt="" className="h-7 w-7" />
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <p className="mt-0.5 text-sm font-bold text-ink">프로필 이미지</p>
          <p className="mt-0.5 text-xs text-ink-subtle">
            선택 사항 · 최대 5MB
          </p>
          {imageError && (
            <p role="alert" className="mt-2 text-xs font-medium text-danger">
              {imageError}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="edit-nickname"
            className="text-xs font-bold text-ink"
          >
            닉네임
          </label>
          <div
            className={cn(
              "mt-1.5 flex h-12 items-center gap-2 rounded-lg border border-border bg-surface pr-3 pl-4 focus-within:border-ink",
              nicknameError && "border-danger focus-within:border-danger",
            )}
          >
            <input
              id="edit-nickname"
              value={nickname}
              onChange={(event) => handleNicknameChange(event.target.value)}
              placeholder="2~12자"
              className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCheckNickname}
              disabled={nicknameCheck.isPending}
              className="shrink-0 text-xs font-bold text-brand disabled:text-ink-subtle"
            >
              {nicknameCheck.isPending ? "확인 중…" : "중복 확인"}
            </button>
          </div>
          <NicknameMessage error={nicknameError} check={nicknameCheck} />

          <label
            htmlFor="edit-email"
            className="mt-5 block text-xs font-bold text-ink"
          >
            이메일
          </label>
          <input
            id="edit-email"
            value={email}
            readOnly
            placeholder="로그인한 이메일이 없어요"
            className="mt-1.5 h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
          />
        </div>
      </form>

      <section className="mt-auto flex flex-col gap-4 rounded-lg border border-danger bg-danger/10 py-5 pr-5 pl-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-bold text-danger">회원 탈퇴</h2>
          <p className="mt-1 text-xs text-danger">
            탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수
            없습니다.
          </p>
        </div>
        <button
          type="button"
          onClick={handleWithdraw}
          className="h-10 shrink-0 rounded-md border border-danger bg-surface px-4 text-sm font-bold text-danger"
        >
          회원 탈퇴
        </button>
      </section>
    </main>
  );
}

interface NicknameMessageProps {
  error: string | null;
  check: UseMutationResult<AvailabilityResponse, Error, string>;
}

function NicknameMessage({ error, check }: NicknameMessageProps) {
  if (error) {
    return (
      <p role="alert" className="mt-2 text-xs font-medium text-danger">
        {error}
      </p>
    );
  }
  if (check.isError) {
    return (
      <p role="alert" className="mt-2 text-xs font-medium text-danger">
        {getServerErrorMessage(check.error)}
      </p>
    );
  }
  if (check.isSuccess) {
    return (
      <p
        role="status"
        className={cn(
          "mt-2 text-xs font-medium",
          check.data.available ? "text-brand" : "text-danger",
        )}
      >
        {check.data.available
          ? "사용할 수 있는 닉네임이에요."
          : "이미 사용 중인 닉네임이에요."}
      </p>
    );
  }
  return null;
}
