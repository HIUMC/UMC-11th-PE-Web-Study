import { useAuthStore } from "../stores/auth-store";
import { apiClient } from "./api-client";

export const authApi = apiClient.extend({
  hooks: {
    beforeRequest: [({ request }) => {
      const accessToken = useAuthStore.getState().accessToken;
      if (accessToken) request.headers.set("Authorization", `Bearer ${accessToken}`);
    }],
    afterResponse: [({ request, response }) => {
      const accessToken = useAuthStore.getState().accessToken;
      // 이전 계정의 늦은 401 응답이 새 로그인 토큰을 지우지 않도록 요청 토큰도 비교
      if (response.status === 401 && accessToken && request.headers.get("Authorization") === `Bearer ${accessToken}`) {
        useAuthStore.getState().setAccessToken(null);
      }
    }],
  },
});
