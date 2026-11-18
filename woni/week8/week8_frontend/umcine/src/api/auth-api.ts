import { useAuthStore } from "../stores/auth-store";
import { apiClient } from "./api-client";

// 토큰이 필요한 요청에 사용하는 인스턴스 (기존 apiClient 설정을 그대로 이어받음)
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
        // 토큰이 만료되었거나 올바르지 않으면 저장된 토큰을 비움
        if (response.status === 401) {
          useAuthStore.getState().setAccessToken(null);
        }
      },
    ],
  },
});
