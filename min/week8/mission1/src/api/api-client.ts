import ky, { HTTPError } from "ky";
import { env } from "../config/env";
import { useAuthStore } from "../store/auth-store";

export const apiClient = ky.create({ prefix: env.apiBaseUrl, timeout: 10000, retry: 0 });

export interface ApiResponse<T> { isSuccess: boolean; code: string; message: string; result: T }
export function authHeaders() {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}
export async function apiErrorMessage(error: unknown) {
  if (error instanceof HTTPError) {
    const body = await error.response.clone().json().catch(() => null) as { message?: string } | null;
    return body?.message || `요청에 실패했어요. (HTTP ${error.response.status})`;
  }
  return error instanceof Error && error.message !== "Failed to fetch" ? error.message : "서버에 연결할 수 없어요. 서버 실행 상태를 확인해 주세요.";
}
export async function authenticatedResult<T>(request: Promise<ApiResponse<T>>) {
  try {
    const response = await request;
    if (!response.isSuccess) throw new Error(response.message);
    return response.result;
  } catch (error) {
    if (error instanceof HTTPError && error.response.status === 401) {
      useAuthStore.getState().logout();
      location.assign("/login?expired=1");
    }
    throw error;
  }
}
