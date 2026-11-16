import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  AccountPanel,
  accountButtonClass,
  accountInputClass,
  accountLinkClass,
} from "../../components/account/account-panel";
import { previewProfile } from "./profile-preview";

export function EditProfilePage() {
  const [nickname, setNickname] = useState(previewProfile.nickname);
  const [previewNickname, setPreviewNickname] = useState<string>();
  const normalized = nickname.trim();
  const invalid = normalized.length < 2 || normalized.length > 12;

  return (
    <AccountPanel title="내 정보 수정" description="닉네임 변경 결과를 미리 확인해 보세요." icon="edit">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!invalid) setPreviewNickname(normalized);
        }}
      >
        <div>
          <label htmlFor="profile-email" className="mb-1.5 block text-sm font-semibold">이메일</label>
          <input
            id="profile-email"
            type="email"
            value={previewProfile.email}
            readOnly
            className={accountInputClass + " bg-gray-50"}
          />
        </div>
        <div>
          <label htmlFor="profile-nickname" className="mb-1.5 block text-sm font-semibold">닉네임</label>
          <input
            id="profile-nickname"
            type="text"
            autoComplete="nickname"
            required
            value={nickname}
            onChange={(event) => {
              setNickname(event.target.value);
              setPreviewNickname(undefined);
            }}
            aria-invalid={invalid}
            aria-describedby="profile-nickname-help"
            className={accountInputClass}
          />
          <p id="profile-nickname-help" className={"mt-1 text-xs " + (invalid ? "text-red-700" : "text-[#555d6d]")}>
            닉네임을 2~12자로 입력해 주세요.
          </p>
        </div>

        <button type="submit" disabled={invalid} className={accountButtonClass + " w-full"}>
          변경 내용 미리보기
        </button>
        {previewNickname && (
          <p role="status" className="rounded-lg bg-[#f3f5ff] p-3 text-sm text-[#344fc4]">
            변경할 닉네임: <strong>{previewNickname}</strong>. 서버에는 저장되지 않아요.
          </p>
        )}
      </form>
      <div className="mt-5 text-center text-sm">
        <Link to="/mypage" className={accountLinkClass}>내 정보로 돌아가기</Link>
      </div>
    </AccountPanel>
  );
}
