import { useAuthStore } from "../stores/auth-store";
import { umcineClient } from "./umcine-client";

// 기존 umcineClient 설정(서버 주소)을 이어받고 인증 처리만 더한 인스턴스
export const authApi = umcineClient.extend({
  hooks: {
    beforeRequest: [
      ({ request }) => {
        // 컴포넌트 밖이라 getState()로 요청 직전의 최신 토큰을 읽음
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      ({ response }) => {
        // 토큰이 없거나 만료되면 401이 오니까 저장된 토큰을 비움
        if (response.status === 401) {
          useAuthStore.getState().setAccessToken(null);
        }
      },
    ],
  },
});
