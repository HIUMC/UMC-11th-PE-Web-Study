import { apiClient } from "./api-client";
import { authApi } from "./auth-api";
import { createAccountService } from "./account-service";

export const login = createAccountService(apiClient).login;
export const account = createAccountService(authApi);
