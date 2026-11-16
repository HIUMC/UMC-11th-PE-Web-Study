import { useState } from "react";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { useNavigate } from "@tanstack/react-router";

export function EditMyInfoPage() {
  const [nickname, setNickname] = useState("youngyoom");
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const navigate = useNavigate();

  const handleCheckNickname = async () => {
    if (isCheckingNickname) return;

    const trimmedNickname = nickname.trim();
    if (trimmedNickname.length < 2 || trimmedNickname.length > 12) {
      alert("닉네임은 2–12자로 입력해 주세요.");
      return;
    }

    setIsCheckingNickname(true);
    try {
      const { available } = await checkNicknameDuplicate(trimmedNickname);
      alert(
        available
          ? "사용할 수 있는 닉네임이에요."
          : "이미 사용 중인 닉네임이에요.",
      );
    } catch {
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsCheckingNickname(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-76px)] w-full max-w-[1440px] flex-col px-6 pt-6 pb-7 text-[#191B20] sm:px-20">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[28px] font-bold">내 정보 수정</h2>
          <p className="mt-2 text-sm text-gray-500">
            닉네임과 프로필 이미지만 변경할 수 있어요.
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-lg bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white"
          onClick={() => navigate({ to: "/mypage" })}
        >
          변경사항 저장
        </button>
      </div>

      <div className="mt-9 grid items-center gap-8 md:grid-cols-2 md:gap-0">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="flex size-20 items-center justify-center rounded-full bg-[#E3E6EB]">
              <img
                src="/icons/person.svg"
                alt="기본 프로필"
                className="size-10"
              />
            </div>
            <button
              type="button"
              aria-label="프로필 이미지 변경"
              className="absolute right-0 bottom-0 flex size-6 items-center justify-center rounded-full border-2 border-[#191B20] bg-gray-100"
            >
              <img src="/icons/edit.svg" alt="" className="size-4" />
            </button>
          </div>
          <h3 className="mt-1 text-sm font-bold">프로필 이미지</h3>
          <p className="mt-1 text-xs text-gray-400">선택 사항 · 최대 5MB</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="nickname" className="mb-2 block text-sm font-bold">
              닉네임
            </label>
            <div className="flex items-center rounded-lg border border-[#E3E6EB] bg-white focus-within:ring-2 focus-within:ring-blue-500">
              <input
                id="nickname"
                name="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                disabled={isCheckingNickname}
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none"
              />
              <button
                type="button"
                onClick={handleCheckNickname}
                disabled={isCheckingNickname}
                className="shrink-0 px-4 py-3 text-xs font-semibold text-[#2563EB]"
              >
                {isCheckingNickname ? "확인 중" : "중복 확인"}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-bold">
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value="gwangsoo@cinemalab.kr"
              readOnly
              className="w-full rounded-lg border border-[#E3E6EB] bg-white px-4 py-3 text-sm"
            />
          </div>
        </div>
      </div>

      <section aria-labelledby="withdrawal" className="mt-auto pt-16">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-[#FF3B30] bg-[#FF3B30]/10 p-5 text-[#FF3B30]">
          <div>
            <h3 id="withdrawal" className="text-sm font-bold">
              회원 탈퇴
            </h3>
            <p className="mt-1 text-xs">
              탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수
              없습니다.
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-lg border border-[#FF3B30] bg-white px-4 py-3 text-sm font-semibold"
          >
            회원 탈퇴
          </button>
        </div>
      </section>
    </main>
  );
}
