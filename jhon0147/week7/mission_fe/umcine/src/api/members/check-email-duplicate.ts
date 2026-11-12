import { apiClient } from "../api-client";
import { createMemberService } from "./member-service";

export const checkEmailDuplicate = createMemberService(apiClient).checkEmailDuplicate;
