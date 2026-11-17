import ky, { type ResponsePromise } from "ky";
import { getValidAccessToken, useAuthStore } from "../stores/auth-store";
import type { ApiResponse } from "../types/member";

export const umcClient = ky.create({
  prefix: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
  headers: { accept: "application/json" },
  timeout: 10_000,
  retry: 0,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const accessToken = getValidAccessToken();
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      ({ request, response }) => {
        if (response.status === 401 && request.headers.has("Authorization")) {
          useAuthStore.getState().logOut();
        }
      },
    ],
  },
});

export async function getResult<T>(responsePromise: ResponsePromise) {
  const body = await responsePromise.json<ApiResponse<T>>();
  return body.result;
}
