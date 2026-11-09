import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { FormField } from "../../components/auth/form-field";
import { useProfileStore } from "../../stores/profile-store";
import { isValidNickname } from "../../utils/members/validation";

const INTRODUCTION_MAX_LENGTH = 100;

export function MyPageEdit() {
  const navigate = useNavigate();
  const profile = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);

  // 저장 전까지는 store 말고 이 화면 state만 바꿈
  const [form, setForm] = useState({
    nickname: profile.nickname,
    introduction: profile.introduction,
  });

  const isNicknameValid = isValidNickname(form.nickname);
  const isIntroductionValid =
    form.introduction.length <= INTRODUCTION_MAX_LENGTH;
  const isChanged =
    form.nickname.trim() !== profile.nickname ||
    form.introduction.trim() !== profile.introduction;
  const canSubmit = isNicknameValid && isIntroductionValid && isChanged;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    // 내 정보 수정 API는 8주차에 연결 예정
    updateProfile({
      nickname: form.nickname.trim(),
      introduction: form.introduction.trim(),
    });
    alert("내 정보를 수정했어요.");
    navigate({ to: "/mypage" });
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-6 py-12">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-[360px] flex-col gap-4"
      >
        <h1 className="text-2xl font-bold">내 정보 수정</h1>

        <FormField
          id="edit-email"
          label="이메일"
          type="email"
          icon="/icons/mail.svg"
          value={profile.email}
          readOnly
        />

        <FormField
          id="edit-nickname"
          label="닉네임"
          icon="/icons/person.svg"
          placeholder="2~12자"
          value={form.nickname}
          errorMessage={
            isNicknameValid ? null : "닉네임은 2자 이상 12자 이하로 입력해 주세요."
          }
          onChange={(nickname) => setForm((prev) => ({ ...prev, nickname }))}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="edit-introduction" className="text-sm font-bold">
            한 줄 소개
          </label>
          <textarea
            id="edit-introduction"
            value={form.introduction}
            placeholder="좋아하는 영화 장르나 나를 소개해 보세요."
            onChange={(event) =>
              setForm((prev) => ({ ...prev, introduction: event.target.value }))
            }
            className="h-24 resize-none rounded-md border border-gray-200 bg-white p-3 text-sm outline-none"
          />
          <p
            className={
              isIntroductionValid
                ? "text-right text-xs text-gray-400"
                : "text-right text-xs text-red-500"
            }
          >
            {form.introduction.length}/{INTRODUCTION_MAX_LENGTH}
          </p>
        </div>

        <div className="mt-2 flex gap-2">
          <Link
            to="/mypage"
            className="flex-1 rounded-md border border-gray-300 bg-white py-3 text-center text-sm font-bold text-gray-600"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex-1 rounded-md bg-blue-600 py-3 text-sm font-bold text-white disabled:bg-blue-300"
          >
            저장
          </button>
        </div>
      </form>
    </main>
  );
}
