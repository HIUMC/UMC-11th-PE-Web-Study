import ky, { isHTTPError } from "ky";
import { env } from "../config/env";
import { useAuthStore } from "../stores/auth-store";
import { changeSession, isCurrentSession } from "./account-session";

export type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

export const apiClient = ky.create({
  baseUrl: env.apiBaseUrl.replace(/\/+$/, "") + "/",
  retry: 0,
  cache: "no-store",
});

export const authApi = apiClient.extend({
  hooks: {
    beforeRequest: [({ request, options }) => {
      const { accessToken, sessionId } = useAuthStore.getState();
      if (!accessToken || options.context.sessionId !== sessionId) {
        throw new Error("다시 로그인해 주세요.");
      }

      request.headers.set("Authorization", "Bearer " + accessToken);
    }],
    afterResponse: [({ response, options }) => {
      const { sessionId } = options.context;
      if (response.status === 401 && typeof sessionId === "number" && isCurrentSession(sessionId)) {
        changeSession(null);
      }
    }],
  },
});

export function readMemberApiError(error: unknown) {
  if (isHTTPError(error)) {
    const data = error.data;
    return {
      status: error.response.status,
      code: data && typeof data === "object" && "code" in data ? data.code : undefined,
      message:
        data && typeof data === "object" && "message" in data &&
        typeof data.message === "string" && data.message.trim()
          ? data.message
          : "서버가 요청을 처리하지 못했어요. 다시 시도해 주세요.",
    };
  }

  return {
    status: undefined,
    code: undefined,
    message: "응답을 받지 못했어요. 서버 주소와 실행 상태를 확인해 주세요.",
  };
}
