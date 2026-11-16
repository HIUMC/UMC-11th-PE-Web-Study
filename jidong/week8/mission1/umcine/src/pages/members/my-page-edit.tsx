import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import type { MemberInfo } from "../../api/members/me";
import { FormField } from "../../components/auth/form-field";
import { useMeQuery } from "../../hooks/use-me-query";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { isValidNickname } from "../../utils/members/validation";

export function MyPageEdit() {
  const meQuery = useMeQuery();

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-6 py-12">
      {meQuery.isPending ? (
        <p aria-busy="true" className="text-sm text-gray-500">
          내 정보를 불러오는 중이에요.
        </p>
      ) : meQuery.isError ? (
        <p role="alert" className="text-sm text-red-500">
          내 정보를 불러오지 못했어요.
        </p>
      ) : (
        // 내 정보를 받은 다음에 폼을 만들어서 입력칸 초기값을 서버 값으로 채움
        <EditForm me={meQuery.data} />
      )}
    </main>
  );
}

function EditForm({ me }: { me: MemberInfo }) {
  const navigate = useNavigate();
  const updateMeMutation = useUpdateMeMutation();
  const [form, setForm] = useState({ nickname: me.nickname });

  const nickname = form.nickname.trim();
  const isNicknameValid = isValidNickname(nickname);
  const canSubmit = isNicknameValid && nickname !== me.nickname;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;

    // 성공하면 훅에서 setQueryData로 캐시를 고쳐서 마이페이지에 새 닉네임이 바로 보임
    updateMeMutation.mutate(
      { nickname },
      { onSuccess: () => navigate({ to: "/mypage" }) },
    );
  };

  return (
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
        value={me.email}
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
        onChange={(value) => setForm({ nickname: value })}
      />

      <div className="mt-2 flex gap-2">
        <Link
          to="/mypage"
          className="flex-1 rounded-md border border-gray-300 bg-white py-3 text-center text-sm font-bold text-gray-600"
        >
          취소
        </Link>
        <button
          type="submit"
          disabled={!canSubmit || updateMeMutation.isPending}
          className="flex-1 rounded-md bg-blue-600 py-3 text-sm font-bold text-white disabled:bg-blue-300"
        >
          {updateMeMutation.isPending ? "저장 중" : "저장"}
        </button>
      </div>
    </form>
  );
}
