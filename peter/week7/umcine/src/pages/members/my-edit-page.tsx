import { useState } from "react";
import { checkNicknameDuplicate } from "@/api/members/check-nickname-duplicate";

export function MyEditPage() {
  const [nickname, setNickname] = useState("USER");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const isNicknameValid =
    nickname.trim().length >= 2 && nickname.trim().length <= 12;

  const handleChangeNickname = (value: string) => {
    if (isChecking) return;
    setNickname(value);
    setIsAvailable(null);
  };

  const handleCheckNickname = async () => {
    if (!isNicknameValid || isChecking) return;

    setIsChecking(true);
    setIsAvailable(null);
    try {
      const response = await checkNicknameDuplicate(nickname.trim());
      setIsAvailable(response.available);
      alert(
        response.available
          ? "사용할 수 있는 닉네임이에요."
          : "이미 사용 중인 닉네임이에요.",
      );
    } catch {
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsChecking(false);
    }
  };


  return (
    <main className="flex min-h-[calc(100vh-148px)] flex-col gap-8 bg-[#f6f7f9] px-4 py-6 sm:px-10 xl:px-20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold text-[#17191e]">
            내 정보 수정
          </h1>
          <p className="mt-2 text-sm text-[#969da8]">
            닉네임과 프로필 이미지만 변경할 수 있어요.
          </p>
        </div>

        <button
          type="submit"
          form="profile-form"
          className="shrink-0 cursor-pointer rounded-lg bg-[#2563eb] px-4 py-3 text-sm font-extrabold text-white"
        >
          변경사항 저장
        </button>
      </div>

      <form
        id="profile-form"
        onSubmit={(e) => e.preventDefault()}
        className="grid grid-cols-1 gap-8 md:grid-cols-2"
      >
        <div className="flex flex-col items-center justify-start gap-2 pt-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e3e6eb]">
            <img
              src="/icons/movie-icons/person.svg"
              alt="기본 프로필"
              className="h-10 w-10"
            />
          </div>
          <p className="text-sm font-bold text-[#17191e]">
            프로필 이미지
          </p>
          <p className="text-xs text-[#969da8]">선택 사항 · 최대 5MB</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="nickname"
              className="text-sm font-extrabold text-[#17191e]"
            >
              닉네임
            </label>

            <div className="flex h-12 items-center gap-3 rounded-lg border border-[#e3e6eb] bg-white px-4 focus-within:ring-2 focus-within:ring-[#2563eb]">
              <input
                id="nickname"
                type="text"
                value={nickname}
                disabled={isChecking}
                onChange={(e) => handleChangeNickname(e.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
              <button
                type="button"
                disabled={!isNicknameValid || isChecking}
                onClick={handleCheckNickname}
                className="shrink-0 text-xs font-extrabold text-[#2563eb] enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            {isAvailable !== null && (
              <p
                role="status"
                className={isAvailable ? "text-xs text-green-600" : "text-xs text-red-600"}
              >
                {isAvailable
                  ? "사용할 수 있는 닉네임이에요."
                  : "이미 사용 중인 닉네임이에요."}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-extrabold text-[#17191e]"
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              value="name@example.com"
              readOnly
              className="h-12 w-full rounded-lg border border-[#e3e6eb] bg-white px-4 text-sm text-[#17191e]"
            />
          </div>
        </div>
      </form>
    </main>
  );
}