//api/auth-api
import { useAuthStore } from "../stores/auth-store";
import { apiClient } from "./api-client";

//기존 apiClient의 서버 주소와 설정을 이어받아서 인증용 인스턴스 만듦
export const authApi = apiClient.extend({
  hooks: {
    beforeRequest: [
      ({ request }) => {
        //요청 직전에 Zustand store에서 현재 토큰을 읽음
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
          // 토큰이 있으면 서버가 읽을 수 있도록 Authorization 헤더에 추가
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      ({ response }) => {
        //서버가 인증 실패 반환 시 저장 토큰 비움
        if (response.status === 401) {
          useAuthStore.getState().setAccessToken(null);
        }
      },
    ],
  },
});
