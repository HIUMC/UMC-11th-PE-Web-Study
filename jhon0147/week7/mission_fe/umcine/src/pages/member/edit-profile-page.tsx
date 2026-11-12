import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { FormField, primaryButtonClass } from "../../components/auth/form-field";
import { useProfileStore } from "../../stores/profile-store";
import { isNicknameValid } from "../../utils/auth-validation";

export function EditProfilePage() {
  const profile = useProfileStore();
  const [nickname, setNickname] = useState(profile.nickname);
  const navigate = useNavigate();
  const isValid = isNicknameValid(nickname);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid) return;
    profile.updateNickname(nickname.trim());
    void navigate({ to: "/mypage" });
  }

  return (
    <main className="flex flex-1 justify-center px-4 py-12 sm:py-20">
      <section className="w-full max-w-108" aria-labelledby="edit-profile-title">
        <h1 id="edit-profile-title" className="text-3xl font-extrabold tracking-tight">내 정보 수정</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">예시 정보를 수정해 볼 수 있어요. 새로고침하면 초기화돼요.</p>
        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="mx-auto grid size-20 place-items-center rounded-full bg-blue-50"><img src="/icons/person.svg" alt="기본 프로필" className="size-10 opacity-60" /></div>
          <FormField id="profile-email" label="이메일" type="email" value={profile.email} readOnly hint="이메일은 변경할 수 없어요." />
          <FormField id="profile-nickname" label="닉네임" name="nickname" autoComplete="nickname" value={nickname}
            onChange={event => setNickname(event.target.value)} hint="2~12자로 입력해 주세요."
            error={!isValid ? "닉네임은 2~12자로 입력해 주세요." : undefined} />
          <button type="submit" className={primaryButtonClass} disabled={!isValid}>저장하기</button>
          <Link to="/mypage" className="block rounded py-1 text-center text-sm font-semibold text-slate-500 hover:text-slate-900">취소</Link>
        </form>
      </section>
    </main>
  );
}
