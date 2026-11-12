import { apiClient } from "../api-client";
import { createMemberService } from "./member-service";

export const signup = createMemberService(apiClient).signup;
