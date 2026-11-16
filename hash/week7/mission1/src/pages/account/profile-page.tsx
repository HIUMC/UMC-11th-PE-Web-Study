import { Link } from "@tanstack/react-router";
import { AccountPanel, accountButtonClass } from "../../components/account/account-panel";

import { previewProfile } from "./profile-preview";

export function ProfilePage() {
  return (
    <AccountPanel title="내 정보" description="예시 계정의 프로필을 확인할 수 있어요." icon="person">
      <dl className="divide-y divide-[#e5e8f0] rounded-xl border border-[#e5e8f0]">
        <div className="px-4 py-3">
          <dt className="text-xs text-[#555d6d]">이메일</dt>
          <dd className="mt-1 break-all text-sm font-semibold">{previewProfile.email}</dd>
        </div>
        <div className="px-4 py-3">
          <dt className="text-xs text-[#555d6d]">닉네임</dt>
          <dd className="mt-1 text-sm font-semibold">{previewProfile.nickname}</dd>
        </div>
      </dl>
      <Link to="/mypage/edit" className={accountButtonClass + " mt-5 w-full"}>
        내 정보 수정
      </Link>
    </AccountPanel>
  );
}
