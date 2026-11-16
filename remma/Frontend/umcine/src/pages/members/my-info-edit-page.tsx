import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { myInfoQueryKey } from "../../api/members/get-my-info";
import {
  updateMyInfo,
  type UpdateMyInfoRequest,
} from "../../api/members/update-my-info";
import type { MemberResult } from "../../api/members/signup";
import { getApiErrorMessage } from "../../api/api-response";
import { useMyInfoQuery } from "../../hooks/use-my-info-query";
import { useAuthStore } from "../../stores/auth-store";
import { PASSWORD_REGEX, isValidNickname } from "../../utils/auth/validation";
import { cn } from "../../utils/cn";

type DuplicateStatus = "idle" | "checking" | "available" | "unavailable" | "error";

const INPUT_CLASS_NAME =
  "w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-600 disabled:bg-gray-50";

export function MyInfoEditPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const myInfoQuery = useMyInfoQuery();

  if (accessToken === null) {
    return <Navigate to="/login" search={{ redirect: "/me/edit" }} replace />;
  }

  if (myInfoQuery.isPending) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">내 정보를 불러오는 중이에요.</p>
      </main>
    );
  }

  if (myInfoQuery.isError) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold text-gray-900">내 정보를 불러오지 못했어요.</p>
        <button
          type="button"
          onClick={() => myInfoQuery.refetch()}
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          다시 시도하기
        </button>
      </main>
    );
  }

  // 조회가 끝난 뒤에 폼을 그려야 기존 닉네임으로 입력값을 초기화할 수 있어요.
  return <MyInfoEditForm member={myInfoQuery.data} />;
}

function MyInfoEditForm({ member }: { member: MemberResult }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1. 입력값 상태
  const [nickname, setNickname] = useState(member.nickname);
  const [nicknameStatus, setNicknameStatus] = useState<DuplicateStatus>("idle");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null);

  // 2. 닉네임 유효성 검사 (기존 닉네임과 같으면 변경하지 않은 것으로 봐요)
  const trimmedNickname = nickname.trim();
  const isNicknameChanged = trimmedNickname !== member.nickname;
  const isNicknameValid = isValidNickname(trimmedNickname);
  const isNicknameReady =
    !isNicknameChanged || (isNicknameValid && nicknameStatus === "available");

  // 3. 비밀번호 유효성 검사 (하나라도 입력하면 비밀번호를 변경하는 것으로 봐요)
  const isPasswordChanging =
    currentPassword.length > 0 || newPassword.length > 0 || newPasswordConfirm.length > 0;
  const isNewPasswordValid = PASSWORD_REGEX.test(newPassword);
  const isNewPasswordDifferent = newPassword !== currentPassword;
  const isNewPasswordConfirmValid =
    newPasswordConfirm.length > 0 && newPassword === newPasswordConfirm;
  const isPasswordReady =
    !isPasswordChanging ||
    (currentPassword.length > 0 &&
      isNewPasswordValid &&
      isNewPasswordDifferent &&
      isNewPasswordConfirmValid);

  // 4. 정보 수정 요청
  const updateMutation = useMutation({
    mutationFn: updateMyInfo,
    onSuccess: async (response) => {
      if (response.result) {
        queryClient.setQueryData(myInfoQueryKey, response.result);
      } else {
        await queryClient.invalidateQueries({ queryKey: myInfoQueryKey });
      }
      alert(response.message || "내 정보가 수정되었어요.");
      navigate({ to: "/me" });
    },
    onError: async (error) => {
      setSubmitErrorMessage(await getApiErrorMessage(error, "내 정보 수정에 실패했어요."));
    },
  });

  const isSubmitting = updateMutation.isPending;
  const hasChanges = isNicknameChanged || isPasswordChanging;
  const canSubmit = hasChanges && isNicknameReady && isPasswordReady && !isSubmitting;

  // 닉네임 중복 확인 핸들러
  async function handleCheckNickname() {
    if (!isNicknameChanged || !isNicknameValid || nicknameStatus === "checking") return;

    setNicknameStatus("checking");
    setSubmitErrorMessage(null);

    try {
      const response = await checkNicknameDuplicate(trimmedNickname);
      setNicknameStatus(response.available ? "available" : "unavailable");
    } catch {
      setNicknameStatus("error");
    }
  }

  // 수정 폼 제출 핸들러
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitErrorMessage(null);

    // 변경한 항목만 요청에 담아요. (newPasswordConfirm은 보내지 않음)
    const request: UpdateMyInfoRequest = {};
    if (isNicknameChanged) {
      request.nickname = trimmedNickname;
    }
    if (isPasswordChanging) {
      request.currentPassword = currentPassword;
      request.newPassword = newPassword;
    }

    updateMutation.mutate(request);
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xs">
        <h1 className="text-2xl font-extrabold text-gray-950">내 정보 수정</h1>
        <p className="mt-1 text-sm text-gray-500">
          변경할 항목만 입력하고 저장해 주세요.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          {/* 1. 이메일 (수정 불가) */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={member.email}
              disabled
              className={cn(INPUT_CLASS_NAME, "mt-1.5 text-gray-500")}
            />
            <p className="mt-1.5 text-xs text-gray-400">이메일은 변경할 수 없어요.</p>
          </div>

          {/* 2. 닉네임 입력 및 중복 확인 */}
          <div>
            <label htmlFor="nickname" className="block text-sm font-semibold text-gray-900">
              닉네임
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setNicknameStatus("idle");
                }}
                placeholder="2~12자 이내로 입력"
                disabled={isSubmitting}
                className={INPUT_CLASS_NAME}
              />
              <button
                type="button"
                onClick={handleCheckNickname}
                disabled={
                  !isNicknameChanged ||
                  !isNicknameValid ||
                  nicknameStatus === "checking" ||
                  isSubmitting
                }
                className="shrink-0 rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {nicknameStatus === "checking" ? "확인 중..." : "중복 확인"}
              </button>
            </div>
            {nickname.length > 0 && !isNicknameValid && (
              <p className="mt-1.5 text-xs text-red-600">
                닉네임은 2자 이상 12자 이하로 입력해 주세요.
              </p>
            )}
            {isNicknameChanged && isNicknameValid && nicknameStatus === "idle" && (
              <p className="mt-1.5 text-xs text-gray-500">닉네임 중복 확인을 해 주세요.</p>
            )}
            {isNicknameValid && nicknameStatus === "available" && (
              <p className="mt-1.5 text-xs text-blue-600">사용 가능한 닉네임이에요.</p>
            )}
            {isNicknameValid && nicknameStatus === "unavailable" && (
              <p className="mt-1.5 text-xs text-red-600">이미 사용 중인 닉네임이에요.</p>
            )}
            {nicknameStatus === "error" && (
              <p className="mt-1.5 text-xs text-red-600">닉네임 중복 확인에 실패했어요.</p>
            )}
          </div>

          {/* 3. 비밀번호 변경 (선택) */}
          <fieldset className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4">
            <legend className="px-1 text-sm font-semibold text-gray-900">
              비밀번호 변경 <span className="font-normal text-gray-400">(선택)</span>
            </legend>

            <div>
              <label
                htmlFor="currentPassword"
                className="block text-xs font-semibold text-gray-700"
              >
                현재 비밀번호
              </label>
              <input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="현재 비밀번호 입력"
                disabled={isSubmitting}
                className={cn(INPUT_CLASS_NAME, "mt-1.5")}
              />
              {isPasswordChanging && currentPassword.length === 0 && (
                <p className="mt-1.5 text-xs text-red-600">
                  현재 비밀번호를 입력해 주세요.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-xs font-semibold text-gray-700">
                새 비밀번호
              </label>
              <input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="대/소문자, 숫자, 특수문자 포함 8자 이상"
                disabled={isSubmitting}
                className={cn(INPUT_CLASS_NAME, "mt-1.5")}
              />
              {newPassword.length > 0 && !isNewPasswordValid && (
                <p className="mt-1.5 text-xs text-red-600">
                  대문자, 소문자, 숫자, 특수문자(!@#$%^&*)를 포함해 8자 이상 입력해 주세요.
                </p>
              )}
              {isNewPasswordValid && !isNewPasswordDifferent && (
                <p className="mt-1.5 text-xs text-red-600">
                  현재 비밀번호와 다른 비밀번호를 입력해 주세요.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="newPasswordConfirm"
                className="block text-xs font-semibold text-gray-700"
              >
                새 비밀번호 확인
              </label>
              <input
                id="newPasswordConfirm"
                type="password"
                autoComplete="new-password"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                placeholder="새 비밀번호를 한 번 더 입력"
                disabled={isSubmitting}
                className={cn(INPUT_CLASS_NAME, "mt-1.5")}
              />
              {newPasswordConfirm.length > 0 && !isNewPasswordConfirmValid && (
                <p className="mt-1.5 text-xs text-red-600">비밀번호가 일치하지 않아요.</p>
              )}
            </div>
          </fieldset>

          {/* 4. 서버 오류 안내 메시지 */}
          {submitErrorMessage && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-xs font-medium text-red-600"
            >
              {submitErrorMessage}
            </div>
          )}

          {/* 5. 버튼 */}
          <div className="mt-2 flex gap-3">
            <Link
              to="/me"
              className="flex-1 rounded-xl border border-gray-300 bg-white py-3 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={!canSubmit}
              className={cn(
                "flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-colors",
                canSubmit ? "bg-blue-600 hover:bg-blue-700" : "cursor-not-allowed bg-gray-300",
              )}
            >
              {isSubmitting ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default MyInfoEditPage;
