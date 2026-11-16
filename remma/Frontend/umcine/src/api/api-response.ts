import { isHTTPError } from "ky";

/** 백엔드 공통 응답 형식 */
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T | null;
}

/**
 * ky 요청에서 발생한 에러를 사용자에게 보여줄 메시지로 바꿔요.
 * 서버가 내려준 message가 있으면 우선 사용해요.
 */
export async function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (isHTTPError(error)) {
    try {
      const errorBody = await error.response.clone().json<Partial<ApiResponse<unknown>>>();
      return errorBody.message || fallbackMessage;
    } catch {
      return fallbackMessage;
    }
  }
  return "서버와 연결할 수 없어요. 잠시 후 다시 시도해 주세요.";
}
