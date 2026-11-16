import { umcineClient } from "../umcine-client";
import type { AvailabilityResponse } from "./models";

type CheckEmailResponse = AvailabilityResponse;

function checkEmail(email: string) {
  return umcineClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<CheckEmailResponse>();
}

export { checkEmail, type CheckEmailResponse };
