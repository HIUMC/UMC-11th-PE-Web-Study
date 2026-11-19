import { HTTPError } from "ky";

// 서버 공통 에러 응답의 message 우선 사용, 없으면 기본 문구 반환
export async function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof HTTPError) {
    try {
      const body = (await error.response.clone().json()) as { message?: string };
      if (body.message) return body.message;
    } catch {
      // 본문이 JSON이 아니면 기본 문구 사용
    }
  }
  return fallback;
}
