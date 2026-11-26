import { apiClient } from "./api-client";
import { useAuthStore } from "../stores/auth-store";

export const authApi = apiClient.extend({
  hooks: {
    afterResponse: [
      ({ request, response }) => {
        const { accessToken, clearAccessToken } = useAuthStore.getState();
        // An older request must not log out a newly signed-in account.
        if (response.status === 401 && accessToken &&
            request.headers.get("Authorization") === `Bearer ${accessToken}` &&
            !new URL(request.url).pathname.endsWith("/auth/login")) {
          clearAccessToken(true);
        }
      },
    ],
    beforeRequest: [
      ({ request }) => {
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
  },
});
