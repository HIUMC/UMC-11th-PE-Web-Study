import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { AccountLayout } from "@/components/layout/account-layout";
import { useProfileStore } from "@/stores/profile-store";

export function EditProfilePage() {
  const profile = useProfileStore((state) => state.profile);
  const updateNickname = useProfileStore((state) => state.updateNickname);
  const [nickname, setNickname] = useState(profile.nickname);
  const navigate = useNavigate();
  const trimmedNickname = nickname.trim();
  const isNicknameValid = trimmedNickname.length >= 2 && trimmedNickname.length <= 12;
  const hasChanges = trimmedNickname !== profile.nickname;
  const showNicknameError = nickname !== profile.nickname && !isNicknameValid;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isNicknameValid || !hasChanges) return;
    updateNickname(trimmedNickname);
    void navigate({ to: "/mypage" });
  };

  return (
    <AccountLayout title="내 정보 수정" description="UMCine에서 사용할 닉네임을 변경해 보세요.">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="profile-email" className="mb-1.5 block text-[13px] leading-5 font-bold">이메일</label>
          <input id="profile-email" name="email" type="email" value={profile.email} readOnly aria-describedby="profile-email-description" className="h-12 w-full rounded-lg border border-gray-200 bg-gray-100 px-3.5 text-sm text-gray-500 outline-none focus:border-[#4f60ee]" />
          <p id="profile-email-description" className="mt-1 text-[11px] leading-4 text-gray-500">이메일은 변경할 수 없습니다.</p>
        </div>
        <div>
          <label htmlFor="profile-nickname" className="mb-1.5 block text-[13px] leading-5 font-bold">닉네임</label>
          <input
            id="profile-nickname"
            name="nickname"
            autoComplete="nickname"
            required
            placeholder="2~12자"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            aria-invalid={showNicknameError}
            aria-describedby="profile-nickname-description"
            className={`h-12 w-full rounded-lg border bg-white px-3.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#4f60ee] focus:ring-2 focus:ring-[#4f60ee]/15 ${showNicknameError ? "border-red-400" : "border-gray-200"}`}
          />
          <p id="profile-nickname-description" aria-live="polite" className={`mt-1 text-[11px] leading-4 ${showNicknameError ? "text-red-600" : "text-gray-500"}`}>닉네임은 2~12자로 입력해 주세요.</p>
        </div>
        <div className="flex gap-3 pt-1">
          <Link to="/mypage" className="flex h-[46px] flex-1 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-bold text-gray-600 hover:bg-gray-50">취소</Link>
          <button type="submit" disabled={!isNicknameValid || !hasChanges} className="h-[46px] flex-[2] rounded-md bg-[#4f60ee] text-sm font-bold text-white transition enabled:cursor-pointer enabled:hover:bg-[#4052de] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f60ee] disabled:cursor-not-allowed disabled:opacity-60">저장하기</button>
        </div>
        <p className="text-center text-xs leading-5 text-gray-500">미리보기 프로필의 닉네임을 현재 탭에 저장합니다.</p>
      </form>
    </AccountLayout>
  );
}
