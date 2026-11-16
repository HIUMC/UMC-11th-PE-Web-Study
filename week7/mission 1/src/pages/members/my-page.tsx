import { Link } from "@tanstack/react-router";
import { AccountLayout } from "@/components/layout/account-layout";
import { useProfileStore } from "@/stores/profile-store";

export function MyPage() {
  const profile = useProfileStore((state) => state.profile);

  return (
    <AccountLayout title="내 정보" description="나의 프로필을 확인하고 수정할 수 있어요.">
      <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
        <div className="mb-7 flex items-center gap-4 border-b border-gray-100 pb-6">
          <span aria-hidden="true" className="grid size-14 shrink-0 place-items-center rounded-full bg-[#4f60ee]/10 text-xl font-bold text-[#4f60ee]">{Array.from(profile.nickname)[0]}</span>
          <div className="min-w-0">
            <p className="break-all text-lg font-bold">{profile.nickname}</p>
            <span className="mt-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500">미리보기 프로필</span>
          </div>
        </div>
        <dl className="space-y-6">
          <div><dt className="mb-2 text-xs font-bold text-gray-500">이메일</dt><dd className="break-all text-sm">{profile.email}</dd></div>
          <div><dt className="mb-2 text-xs font-bold text-gray-500">닉네임</dt><dd className="break-all text-sm">{profile.nickname}</dd></div>
        </dl>
        <Link to="/mypage/edit" className="mt-8 flex h-[46px] w-full items-center justify-center rounded-md bg-[#4f60ee] text-sm font-bold text-white transition hover:bg-[#4052de] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f60ee]">내 정보 수정</Link>
      </div>
      <p className="mt-4 text-center text-xs leading-5 text-gray-500">샘플 프로필입니다. 수정한 내용은 현재 탭에서만 유지됩니다.</p>
    </AccountLayout>
  );
}
