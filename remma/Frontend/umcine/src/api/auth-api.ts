import { useAuthStore } from "../stores/auth-store";
import { apiClient } from "./api-client";

/** 인증이 필요한 요청에 Authorization 헤더를 붙이고 401 응답 시 토큰을 비워요. */
export const authApi = apiClient.extend({
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      ({ response }) => {
        if (response.status === 401) {
          useAuthStore.getState().clearAuth();
        }
      },
    ],
  },
});
