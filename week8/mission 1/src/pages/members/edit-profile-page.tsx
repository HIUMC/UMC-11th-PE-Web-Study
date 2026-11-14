import { useState, type SubmitEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AccountLayout } from "@/components/layout/account-layout";
import { ProfileAvatar } from "@/components/members/profile-avatar";
import { useMemberProfile } from "@/hooks/use-member-profile";
import { useUpdateMeMutation } from "@/hooks/use-update-me-mutation";
import { checkNicknameDuplicate } from "@/api/members/check-nickname-duplicate";

export function EditProfilePage() {
  const { profile, query } = useMemberProfile();
  const [nicknameInput, setNicknameInput] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [checkedNickname, setCheckedNickname] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const updateMeMutation = useUpdateMeMutation();
  const navigate = useNavigate();
  const nickname = (nicknameInput ?? profile?.nickname ?? "").trim();
  const isNicknameValid = nickname.length >= 2 && nickname.length <= 12;
  const changed = nickname !== profile?.nickname;
  const canSubmit = Boolean(profile) && isNicknameValid;
  const showNicknameError = nicknameInput !== null && !isNicknameValid;

  async function handleCheckDuplicate() {
    if (!isNicknameValid || checking) return;
    if (!changed) { setNotice("현재 사용 중인 닉네임이에요."); return; }
    const value = nickname;
    setChecking(true);
    setNotice("");
    try {
      const result = await checkNicknameDuplicate(value);
      setCheckedNickname(result.available ? value : null);
      setNotice(result.available ? "사용할 수 있는 닉네임이에요." : "이미 사용 중인 닉네임이에요.");
    } catch {
      setCheckedNickname(null);
      setNotice("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally { setChecking(false); }
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || updateMeMutation.isPending || checking) return;
    updateMeMutation.mutate({ nickname }, {
      onSuccess: () => {
        void navigate({ to: "/mypage" });
      },
    });
  }

  return (
    <AccountLayout title="내 정보 수정" description="닉네임과 프로필 정보를 관리할 수 있어요." action={
      <button form="edit-profile-form" type="submit" disabled={!canSubmit || updateMeMutation.isPending || checking} aria-busy={updateMeMutation.isPending} className="shrink-0 rounded-md bg-[#4f60ee] px-4 py-3 text-xs font-bold text-white hover:bg-[#4052de] disabled:cursor-not-allowed disabled:opacity-50">
        {updateMeMutation.isPending ? "저장 중" : "변경사항 저장"}
      </button>
    }>
      <form id="edit-profile-form" onSubmit={handleSubmit} noValidate className="grid gap-8 pt-2 sm:grid-cols-2 sm:gap-12">
        <div className="flex flex-col items-center pt-5">
          <div className="relative">
            <ProfileAvatar />
            <button type="button" disabled title="프로필 이미지 업로드 기능은 준비 중입니다" aria-label="프로필 이미지 변경 (준비 중)" className="absolute right-0 bottom-0 grid size-6 cursor-not-allowed place-items-center rounded-full border-2 border-[#191b20] bg-[#f6f7f9]">
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 16-1 4 4-1L20 7l-3-3Z" /><path d="m14 7 3 3" /></svg>
            </button>
          </div>
          <h2 className="mt-2 text-sm font-bold">프로필 이미지</h2>
          <p className="mt-1 text-[11px] text-gray-400">이미지 변경 기능 준비 중</p>
        </div>
        <div className="space-y-5">
          {!profile && <p role="status" className="text-sm text-gray-500">{query.isError ? "회원 정보를 불러오지 못했어요." : "회원 정보를 불러오는 중이에요."}</p>}
          <div>
            <label htmlFor="profile-nickname" className="mb-1.5 block text-xs font-bold">닉네임</label>
            <div className={`flex h-12 overflow-hidden rounded-lg border bg-white focus-within:border-[#4f60ee] focus-within:ring-2 focus-within:ring-[#4f60ee]/15 ${showNicknameError ? "border-red-400" : "border-gray-200"}`}>
              <input id="profile-nickname" name="nickname" autoComplete="nickname" required placeholder="2~12자" value={nicknameInput ?? profile?.nickname ?? ""} disabled={!profile || checking || updateMeMutation.isPending} onChange={(event) => { setNicknameInput(event.target.value); setNotice(""); setCheckedNickname(null); }} aria-invalid={showNicknameError} aria-describedby="nickname-status" className="min-w-0 flex-1 px-4 text-sm outline-none" />
              <button type="button" disabled={!profile || !isNicknameValid || checking || updateMeMutation.isPending} onClick={() => void handleCheckDuplicate()} className="shrink-0 px-4 text-xs font-bold text-[#4f60ee] disabled:cursor-not-allowed disabled:opacity-50">{checking ? "확인 중" : "중복 확인"}</button>
            </div>
            <p id="nickname-status" role="status" className={`mt-2 text-xs ${checkedNickname === nickname ? "text-[#4f60ee]" : "text-gray-500"}`}>{showNicknameError ? "닉네임은 2~12자로 입력해 주세요." : notice}</p>
          </div>
          <div>
            <label htmlFor="profile-email" className="mb-1.5 block text-xs font-bold">이메일</label>
            <input id="profile-email" name="email" type="email" value={profile?.email ?? ""} readOnly title="이메일은 변경할 수 없습니다" className="h-12 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm outline-none focus:border-[#4f60ee]" />
          </div>
        </div>
      </form>
      <section className="mt-auto flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#ef645a] bg-[#ef645a]/10 px-5 py-5 text-[#d84b40] max-sm:mt-20" aria-labelledby="withdraw-title">
        <div><h2 id="withdraw-title" className="text-sm font-bold">회원 탈퇴</h2><p className="mt-1 text-[11px] leading-5">탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.</p></div>
        <button type="button" disabled title="회원 탈퇴 기능은 준비 중입니다" className="cursor-not-allowed rounded-lg border border-[#ef645a] bg-white px-4 py-3 text-xs font-bold">회원 탈퇴</button>
      </section>
    </AccountLayout>
  );
}
