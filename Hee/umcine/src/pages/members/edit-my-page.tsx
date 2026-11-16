import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getMe } from "../../api/members/me";
import type { MemberInfo } from "../../api/members/me";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";

const iconBase = "/icons/movie-icons/movie-icons";

export function EditMyPage() {
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  if (!meQuery.data) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#F7F8FA]">
        <p className="text-sm text-[#68707C]">
          {meQuery.isError ? "내 정보를 불러오지 못했어요." : "내 정보를 불러오는 중이에요."}
        </p>
      </main>
    );
  }

  return <EditMyForm member={meQuery.data} />;
}

function EditMyForm({ member }: { member: MemberInfo }) {
  const updateMeMutation = useUpdateMeMutation();
  const [form, setForm] = useState({ nickname: member.nickname });

  const nickname = form.nickname.trim();
  const canSubmit = nickname.length >= 2 && nickname.length <= 12;

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;

    updateMeMutation.mutate({ nickname });
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#F7F8FA]">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[1100px] flex-col px-5 py-7 sm:py-9">
        <form onSubmit={handleSubmit}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-bold tracking-[-0.03em] text-[#191D23]">내 정보 수정</h1>
              <p className="mt-2 text-xs text-[#8A929E]">닉네임과 프로필 이미지를 변경할 수 있어요.</p>
            </div>
            <button
              type="submit"
              disabled={!canSubmit || updateMeMutation.isPending}
              className="rounded-lg bg-[#2F6FED] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#245DCD] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateMeMutation.isPending ? "저장 중" : "저장"}
            </button>
          </div>

          <section className="mt-10 grid gap-10 md:grid-cols-[220px_minmax(0,1fr)]">
            <div className="flex flex-col items-center">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#E8EBEF]">
                <img src={`${iconBase}/person.svg`} alt="" className="h-11 w-11" />
                <span className="absolute right-0 bottom-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#F7F8FA] bg-[#191D23]">
                  <img src={`${iconBase}/edit.svg`} alt="" className="h-3.5 w-3.5 invert" />
                </span>
              </div>
              <p className="mt-3 text-xs font-semibold text-[#353B45]">프로필 이미지</p>
              <p className="mt-1 text-[11px] text-[#9CA3AF]">JPG 또는 PNG</p>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="edit-nickname" className="mb-2 block text-sm font-semibold text-[#191D23]">
                  닉네임
                </label>
                <input
                  id="edit-nickname"
                  value={form.nickname}
                  onChange={(event) => setForm({ nickname: event.target.value })}
                  maxLength={12}
                  className="h-12 w-full rounded-lg border border-[#DCE1E8] bg-white px-4 text-sm text-[#191D23] outline-none focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED]"
                />
                {!canSubmit && (
                  <p className="mt-1.5 text-xs text-[#D14343]">닉네임은 2~12자로 입력해 주세요.</p>
                )}
              </div>
              <div>
                <label htmlFor="edit-email" className="mb-2 block text-sm font-semibold text-[#191D23]">
                  이메일
                </label>
                <input
                  id="edit-email"
                  value={member.email}
                  readOnly
                  className="h-12 w-full rounded-lg border border-[#DCE1E8] bg-white px-4 text-sm text-[#68707C] outline-none"
                />
              </div>
            </div>
          </section>
        </form>

        <section className="mt-auto flex flex-col gap-4 rounded-xl border border-[#F2A4A4] bg-[#FFF1F1] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#D14343]">회원 탈퇴</h2>
            <p className="mt-1 text-xs text-[#D14343]">
              탈퇴하면 작성한 정보와 계정을 복구할 수 없어요.
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-lg border border-[#E35D5D] bg-white px-4 py-2.5 text-xs font-bold text-[#D14343] hover:bg-[#FFF8F8]"
          >
            회원 탈퇴
          </button>
        </section>
      </div>
    </main>
  );
}
