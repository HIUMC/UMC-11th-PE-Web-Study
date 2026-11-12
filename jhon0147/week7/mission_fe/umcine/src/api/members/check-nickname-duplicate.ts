import { apiClient } from "../api-client";
import { createMemberService } from "./member-service";

export const checkNicknameDuplicate = createMemberService(apiClient).checkNicknameDuplicate;
