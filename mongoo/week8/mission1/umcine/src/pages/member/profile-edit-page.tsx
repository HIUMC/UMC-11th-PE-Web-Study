import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { getMe } from "../../api/members/me";
import type { MemberInfo } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";
import { useProfileStore } from "../../stores/profile-store";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";

export function ProfileEditPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  if (!accessToken) {
    return (
      <main className="page-container py-24 text-center">
        <p className="text-gray-500">로그인이 필요해요.</p>
        <Link
          to="/login"
          className="mt-4 inline-block text-sm text-blue-600"
        >
          로그인하기
        </Link>
      </main>
    );
  }

  if (meQuery.isPending) {
    return (
      <main className="page-container py-24 text-center text-gray-500">
        내 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (meQuery.isError) {
    return (
      <main
        role="alert"
        className="page-container py-24 text-center text-gray-500"
      >
        내 정보를 불러오지 못했어요.
      </main>
    );
  }

  return (
    <ProfileEditForm
      key={meQuery.data.email}
      member={meQuery.data}
    />
  );
}

function ProfileEditForm({ member }: { member: MemberInfo }) {
  const navigate = useNavigate();
  const updateMeMutation = useUpdateMeMutation();

  const savedProfileImage = useProfileStore(
    (state) => state.profile.profileImage,
  );

  const [nickname, setNickname] = useState(member.nickname);
  const [profileImage, setProfileImage] = useState<string | null>(
    savedProfileImage,
  );
  const [imageError, setImageError] = useState("");
  const [isReadingImage, setIsReadingImage] = useState(false);

  const normalizedNickname = nickname.trim();
  const isNicknameValid =
    normalizedNickname.length >= 2 &&
    normalizedNickname.length <= 12;

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setImageError("");

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setImageError("JPG, PNG, WebP 이미지를 선택해 주세요.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("이미지는 최대 5MB까지 선택할 수 있어요.");
      return;
    }

    setIsReadingImage(true);

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
      }
      setIsReadingImage(false);
    };

    reader.onerror = () => {
      setImageError("이미지를 읽지 못했어요. 다시 선택해 주세요.");
      setIsReadingImage(false);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !isNicknameValid ||
      isReadingImage ||
      updateMeMutation.isPending
    ) {
      return;
    }

    updateMeMutation.mutate(
      { nickname: normalizedNickname },
      {
        onSuccess: () => {
          // 이미지 API는 없으므로 화면용 이미지 상태만 변경해요.
          useProfileStore.setState((state) => ({
            profile: {
              ...state.profile,
              profileImage,
            },
          }));

          navigate({ to: "/mypage" });
        },
      },
    );
  };

  return (
    <main className="page-container flex flex-1 flex-col py-5">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-1 flex-col"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight">
              내 정보 수정
            </h1>
            <p className="mt-2 text-xs text-gray-500">
              닉네임과 프로필 이미지만 변경할 수 있어요.
            </p>
          </div>

          <button
            type="submit"
            disabled={
              !isNicknameValid ||
              isReadingImage ||
              updateMeMutation.isPending
            }
            className="shrink-0 rounded-md bg-[#2563eb] px-4 py-2.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateMeMutation.isPending
              ? "저장 중"
              : "변경사항 저장"}
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col items-center pt-4">
            <label
              htmlFor="profile-image"
              className="relative cursor-pointer"
            >
              <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                <img
                  src={profileImage ?? "/icons/person.svg"}
                  alt="프로필 미리보기"
                  className={
                    profileImage
                      ? "h-full w-full object-cover"
                      : "h-10 w-10"
                  }
                />
              </span>

              <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border border-gray-900 bg-[#f5f6f8]">
                <img
                  src="/icons/edit.svg"
                  alt="프로필 이미지 선택"
                  className="h-3 w-3"
                />
              </span>
            </label>

            <input
              id="profile-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={isReadingImage || updateMeMutation.isPending}
              onChange={handleImageChange}
              className="sr-only"
            />

            <p className="mt-2 text-sm font-semibold">
              프로필 이미지
            </p>
            <p className="mt-1 text-[10px] text-gray-400">
              선택 사항 · 최대 5MB
            </p>

            {isReadingImage && (
              <p role="status" className="mt-2 text-xs text-gray-500">
                이미지를 읽는 중이에요.
              </p>
            )}

            {imageError && (
              <p role="alert" className="mt-2 text-xs text-red-600">
                {imageError}
              </p>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="edit-nickname"
                className="mb-2 block text-xs font-semibold"
              >
                닉네임
              </label>

              <div className="relative">
                <input
                  id="edit-nickname"
                  type="text"
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  disabled={updateMeMutation.isPending}
                  aria-invalid={!isNicknameValid}
                  className="w-full rounded-md border border-gray-200 bg-white py-3 pl-3 pr-24 text-sm outline-none focus:border-blue-600"
                />

                <button
                  type="button"
                  disabled
                  className="absolute inset-y-0 right-3 text-xs font-semibold text-blue-600 disabled:cursor-not-allowed"
                >
                  중복 확인
                </button>
              </div>

              {!isNicknameValid && (
                <p className="mt-1 text-xs text-red-600">
                  닉네임은 앞뒤 공백을 제외하고 2~12자로 입력해 주세요.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="edit-email"
                className="mb-2 block text-xs font-semibold"
              >
                이메일
              </label>

              <input
                id="edit-email"
                type="email"
                value={member.email}
                readOnly
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-3 text-sm outline-none"
              />
            </div>
          </div>
        </div>

        <section className="mt-auto pt-20">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-red-400 bg-red-50 px-5 py-4">
            <div>
              <h2 className="text-xs font-bold text-red-500">
                회원 탈퇴
              </h2>
              <p className="mt-1 text-[10px] text-red-500">
                탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며
                복구할 수 없습니다.
              </p>
            </div>

            <button
              type="button"
              disabled
              className="rounded-md border border-red-400 bg-white px-4 py-2.5 text-xs font-semibold text-red-500 disabled:cursor-not-allowed"
            >
              회원 탈퇴
            </button>
          </div>
        </section>
      </form>
    </main>
  );
}