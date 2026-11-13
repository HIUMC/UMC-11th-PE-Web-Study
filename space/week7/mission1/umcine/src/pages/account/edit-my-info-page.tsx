import { useAuthStore } from "../../stores/auth-store";
import { useState, type SubmitEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { getMyInfo } from "../../api/members/get-my-info";
import { updateMyInfo } from "../../api/members/update-my-info";
import type { MemberInfo } from "../../api/members/get-my-info";
import { getApiErrorMessage } from "../../utils/api-error-message";

export function EditMyInfoPage() {
  const profileQuery = useQuery({
    queryKey: ["member", "me"],
    queryFn: ({ signal }) => getMyInfo(signal),
    retry: false,
  });

  if (profileQuery.isPending) {
    return (
      <main className="flex flex-1 items-center justify-center px-5 py-12">
        <p className="text-sm text-text-secondary" role="status">
          불러오는 중
        </p>
      </main>
    );
  }

  if (profileQuery.isError) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-3 px-5 py-12">
        <p className="text-sm text-text-danger" role="alert">
          {getApiErrorMessage(profileQuery.error, "회원 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.")}
        </p>
      </main>
    );
  }

  return <EditMyInfoForm member={profileQuery.data.result} />;
}

function EditMyInfoForm({ member }: { member: MemberInfo }) {
  const navigate = useNavigate({ from: "/my-info/edit" });
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [nickname, setNickname] = useState(member.nickname);
  const [isChecking, setIsChecking] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
  const [checkedNickname, setCheckedNickname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const normalizedNickname = nickname.trim();
  const isNicknameValid =
    normalizedNickname.length >= 2 && normalizedNickname.length <= 12;
  const nicknameChanged = normalizedNickname !== member.nickname;
  const canSave =
    isNicknameValid &&
    (!nicknameChanged ||
      (isNicknameAvailable && checkedNickname === normalizedNickname));

  const updateMutation = useMutation({
    mutationFn: updateMyInfo,
    onSuccess: (response) => {
      if (accessToken !== useAuthStore.getState().accessToken) return;
      queryClient.setQueryData(["member", "me"], response);
      void navigate({ to: "/my-info" });
    },
    onError: async (error) => {
      setErrorMessage(
        await getApiErrorMessage(error, "정보 수정에 실패했어요. 다시 시도해 주세요."),
      );
    },
  });

  async function handleCheckNickname() {
    if (!isNicknameValid || isChecking || !nicknameChanged) return;
    setIsChecking(true);
    setIsNicknameAvailable(false);
    setCheckedNickname("");
    setErrorMessage("");

    try {
      const { available } =
        await checkNicknameDuplicate(normalizedNickname);
      setIsNicknameAvailable(available);
      setCheckedNickname(available ? normalizedNickname : "");
      if (!available) {
        setErrorMessage("이미 사용 중인 닉네임입니다.");
      }
    } catch (error) {
      setErrorMessage(
        await getApiErrorMessage(error, "닉네임 중복 확인에 실패했어요."),
      );
    } finally {
      setIsChecking(false);
    }
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave || updateMutation.isPending) return;

    setErrorMessage("");
    updateMutation.mutate({ nickname: normalizedNickname });
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-5 sm:px-10 lg:px-20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl leading-7 font-bold tracking-tight text-text-primary">
            내 정보 수정
          </h1>
          <p className="mt-1 text-[11px] text-text-secondary">
            닉네임을 변경할 수 있어요.
          </p>
        </div>
        <button
          className="h-8 shrink-0 rounded-md bg-action-primary px-3 text-xs font-extrabold text-bg-surface transition-colors hover:bg-action-primary-hover disabled:cursor-not-allowed disabled:bg-action-disabled"
          type="submit"
          form="edit-profile-form"
          disabled={!canSave || updateMutation.isPending}
        >
          변경사항 저장
        </button>
      </div>

      <form
        className="mt-6 grid gap-8 sm:grid-cols-2 sm:gap-10"
        id="edit-profile-form"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-center pt-2">
          <div className="relative flex size-14 items-center justify-center rounded-full bg-[#E8EBF0]">
            <img className="size-9" src="/icons/person.svg" alt="" />

          </div>
          <span className="mt-1 text-xs font-bold text-text-primary">
            프로필 이미지
          </span>
          <span className="text-[10px] text-text-tertiary">
            기본 프로필 이미지
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label
              className="text-xs font-bold text-text-primary"
              htmlFor="edit-nickname"
            >
              닉네임
            </label>
            <div className="flex h-9 items-center rounded-md border border-border-default bg-bg-surface px-2.5 focus-within:border-action-primary">
              <input
                className="min-w-0 flex-1 bg-transparent text-xs text-text-primary outline-none disabled:text-text-tertiary"
                id="edit-nickname"
                name="nickname"
                value={nickname}
                maxLength={12}
                disabled={isChecking || updateMutation.isPending}
                onChange={(event) => {
                  setNickname(event.currentTarget.value);
                  setIsNicknameAvailable(false);
                  setCheckedNickname("");
                  setErrorMessage("");
                }}
                aria-describedby={errorMessage ? "nickname-error" : undefined}
              />
              {nicknameChanged ? (
                <button
                  className="ml-2 shrink-0 text-[11px] font-bold text-action-primary disabled:cursor-not-allowed disabled:text-text-tertiary"
                  type="button"
                  disabled={!isNicknameValid || isChecking || updateMutation.isPending}
                  onClick={handleCheckNickname}
                >
                  {isChecking ? "확인 중" : "중복 확인"}
                </button>
              ) : null}
            </div>
            {errorMessage ? (
              <p
                className="text-[11px] text-text-danger"
                id="nickname-error"
                role="alert"
              >
                {errorMessage}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-xs font-bold text-text-primary"
              htmlFor="profile-email"
            >
              이메일
            </label>
            <input
              className="h-9 w-full rounded-md border border-border-default bg-bg-surface px-2.5 text-xs text-text-primary"
              id="profile-email"
              name="email"
              type="email"
              value={member.email}
              readOnly
            />
          </div>
        </div>
      </form>

    </main>
  );
}
