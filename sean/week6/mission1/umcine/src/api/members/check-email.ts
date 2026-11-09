import { umcClient } from "../umc-client";
import type { CheckResponse } from "./check-nickname";

export function checkEmail(email: string) {
  return umcClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<CheckResponse>();
}