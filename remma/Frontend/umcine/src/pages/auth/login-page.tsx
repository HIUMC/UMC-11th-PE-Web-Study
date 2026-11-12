import { useState, type FormEvent } from "react";
import { Link, useRouter, useSearch } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../../api/members/login";
import { myInfoQueryKey } from "../../api/members/get-my-info";
import { getApiErrorMessage } from "../../api/api-response";
import { useAuthStore } from "../../stores/auth-store";
import { EMAIL_REGEX } from "../../utils/auth/validation";
import { getSafeRedirectPath } from "../../utils/auth/redirect";
import { cn } from "../../utils/cn";

export function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { redirect } = useSearch({ from: "/login" });
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  // 1. 입력값 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 2. 입력값 유효성 검사
  const trimmedEmail = email.trim();
  const isEmailValid = EMAIL_REGEX.test(trimmedEmail);
  const isPasswordFilled = password.length > 0;

  // 3. 로그인 요청
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      const result = response.result;
      if (!result?.accessToken) {
        setErrorMessage(response.message || "로그인에 실패했어요.");
        return;
      }

      setAccessToken(result.accessToken);
      // 로그인 응답의 회원 정보로 내 정보 캐시를 미리 채워 헤더가 바로 갱신되게 해요.
      queryClient.setQueryData(myInfoQueryKey, {
        memberId: result.memberId,
        email: result.email,
        nickname: result.nickname,
      });

      router.history.push(getSafeRedirectPath(redirect));
    },
    onError: async (error) => {
      setErrorMessage(
        await getApiErrorMessage(error, "이메일 또는 비밀번호를 확인해 주세요."),
      );
    },
  });

  const isSubmitting = loginMutation.isPending;
  const canSubmit = isEmailValid && isPasswordFilled && !isSubmitting;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setErrorMessage(null);
    loginMutation.mutate({ email: trimmedEmail, password });
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xs">
        <h1 className="text-2xl font-extrabold text-gray-950">로그인</h1>
        <p className="mt-1 text-sm text-gray-500">
          다시 만나서 반가워요! UMCine에 로그인해 주세요.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          {/* 1. 이메일 입력 */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
              이메일
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@umcine.com"
              disabled={isSubmitting}
              className="mt-1.5 w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-600 disabled:bg-gray-50"
            />
            {email.length > 0 && !isEmailValid && (
              <p className="mt-1.5 text-xs text-red-600">
                올바른 이메일 형식을 입력해 주세요.
              </p>
            )}
          </div>

          {/* 2. 비밀번호 입력 */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-900">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해 주세요"
              disabled={isSubmitting}
              className="mt-1.5 w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-600 disabled:bg-gray-50"
            />
          </div>

          {/* 3. 서버 오류 안내 메시지 */}
          {errorMessage && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-xs font-medium text-red-600"
            >
              {errorMessage}
            </div>
          )}

          {/* 4. 제출 버튼 */}
          <button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              "mt-2 w-full rounded-xl py-3 text-sm font-semibold text-white transition-colors",
              canSubmit ? "bg-blue-600 hover:bg-blue-700" : "cursor-not-allowed bg-gray-300",
            )}
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
          <span>아직 회원이 아니신가요?</span>
          <Link to="/signup" className="font-semibold text-blue-600 hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
