import { useAuthStore } from "../stores/auth-store";
import { apiClient } from "./api-client";

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
      ({ request, response }) => {
        const currentToken = useAuthStore.getState().accessToken;
        if (response.status === 401 && currentToken && request.headers.get("Authorization") === `Bearer ${currentToken}`) {
          useAuthStore.getState().setAccessToken(null);
        }
      },
    ],
  },
});
