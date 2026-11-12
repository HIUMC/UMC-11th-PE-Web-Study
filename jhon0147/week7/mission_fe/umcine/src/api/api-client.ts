import ky, { HTTPError, TimeoutError } from "ky";
import { env } from "../config/env";

export const apiClient = ky.create({
  baseUrl: `${env.apiBaseUrl}/`,
  timeout: 10_000,
  retry: 0,
});

export function getMemberErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HTTPError) {
    const data = error.data;
    if (data && typeof data === "object" && "message" in data && typeof data.message === "string") {
      return data.message;
    }
    return `${fallback} (HTTP ${error.response.status})`;
  }
  if (error instanceof TimeoutError) return "응답이 늦어지고 있어요. 잠시 후 다시 시도해 주세요.";
  if (error instanceof TypeError || (error instanceof Error && error.name === "NetworkError")) {
    return "서버에 연결할 수 없어요. 서버 주소와 실행 상태를 확인해 주세요.";
  }
  return error instanceof Error ? error.message : fallback;
}
